import Dexie, { Table } from "dexie";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from "openai";
import { settingsAtom, settingsStore } from "../settings";
import { queryClient } from "./client";
import { ConversationKey } from "./hooks/keys";

export type ModelBody = Omit<CreateChatCompletionRequest, "messages">;

export interface Conversation {
  id?: number;
  title: string;
  created: Date;
  updated: Date;
  modelBody: ModelBody;
}

interface Message extends ChatCompletionRequestMessage {
  id?: number;
  created: Date;
  updated: Date;
  conversationId: number;
  modelBody: ModelBody;
}

export type MessageEntry = Omit<Message, "conversationId"> & {
  conversationId?: number;
};

export type ConversationData = Awaited<ReturnType<ConvoDB["getConversation"]>>;

export type ConversationCreateData = Parameters<ConvoDB["createConversation"]>;

export class ConvoDB extends Dexie {
  conversations!: Table<Conversation, number>;
  messages!: Table<Message, number>;

  constructor() {
    super("ConvoDB");
    this.version(1).stores({
      conversations: "++id",
      messages: "++id, conversationId",
    });

    this.version(2).upgrade((tx) => {
      return Promise.all([
        tx
          .table("conversations")
          .toCollection()
          .modify((conversation) => {
            const currentDate = new Date();
            conversation.created = currentDate;
            conversation.updated = currentDate;
          }),
        tx
          .table("messages")
          .toCollection()
          .modify((message) => {
            const currentDate = new Date();
            message.created = currentDate;
            message.updated = currentDate;
          }),
      ]);
    });
  }

  getConversation(conversationId: number) {
    return this.transaction(
      "r",
      this.messages,
      this.conversations,
      async () => {
        const messages = await this.messages
          .where({ conversationId })
          .toArray();
        const conversation = await this.conversations.get(conversationId);
        if (!conversation) throw Error("No conversation found");
        return { ...conversation, messages };
      }
    );
  }

  async deleteConversation(conversationId: number) {
    const deletedConversationId = await this.transaction(
      "rw",
      this.messages,
      this.conversations,
      async () => {
        await this.messages.where({ conversationId }).delete();
        await this.conversations.delete(conversationId);
        return conversationId;
      }
    );

    await queryClient.invalidateQueries(ConversationKey(deletedConversationId));
    return deletedConversationId;
  }

  async createConversation(
    title: string,
    messages: MessageEntry[],
    modelBody?: ModelBody
  ) {
    const createdConversationId = await this.transaction(
      "rw",
      this.messages,
      this.conversations,
      async () => {
        const currentTime = new Date();
        const conversationId = await this.conversations.add({
          title,
          created: currentTime,
          updated: currentTime,
          modelBody:
            modelBody ?? settingsStore.get(settingsAtom).defaultModelBody,
        });
        await this.messages.bulkAdd(
          messages.map((message) => {
            return {
              ...message,
              conversationId,
            };
          })
        );
        return conversationId;
      }
    );

    await queryClient.invalidateQueries(ConversationKey(createdConversationId));

    return createdConversationId;
  }

  async updateConversation(
    conversationId: number,
    ...args: Partial<Parameters<typeof this.createConversation>>
  ) {
    const updatedConversationId = await this.transaction(
      "rw",
      this.messages,
      this.conversations,
      async () => {
        if (args[0] || args[2]) {
          await this.conversations.update(conversationId, {
            updated: new Date(),
          });

          args[0] &&
            (await this.conversations.update(conversationId, {
              title: args[0],
            }));

          args[2] &&
            (await this.conversations.update(conversationId, {
              modelBody: args[2],
            }));
        }

        if (args[1]) {
          await this.messages.where({ conversationId }).delete();
          await this.messages.bulkAdd(
            args[1].map((message) => {
              return { ...message, conversationId };
            })
          );
        }
        return conversationId;
      }
    );
    await queryClient.invalidateQueries(ConversationKey(updatedConversationId));
    return updatedConversationId;
  }
}

export const db = new ConvoDB();
