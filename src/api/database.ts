import Dexie, { Table } from "dexie";
import { ChatCompletionRequestMessage } from "openai";

export interface Conversation {
  id?: number;
  title: string;
}

interface Message extends ChatCompletionRequestMessage {
  id?: number;
  conversationId: number;
}

export class ConvoDB extends Dexie {
  conversations!: Table<Conversation, number>;
  messages!: Table<Message, number>;

  constructor() {
    super("ConvoDB");
    this.version(1).stores({
      conversations: "++id",
      messages: "++id, conversationId",
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

  deleteConversation(conversationId: number) {
    return this.transaction(
      "rw",
      this.messages,
      this.conversations,
      async () => {
        await this.messages.where({ conversationId }).delete();
        await this.conversations.delete(conversationId);
        return conversationId;
      }
    );
  }

  createConversation(title: string, messages: ChatCompletionRequestMessage[]) {
    return this.transaction(
      "rw",
      this.messages,
      this.conversations,
      async () => {
        const conversationId = await this.conversations.add({ title });
        await this.messages.bulkAdd(
          messages.map((message) => {
            return { ...message, conversationId };
          })
        );
        return conversationId;
      }
    );
  }

  updateConversation(
    conversationId: number,
    ...args: Parameters<typeof this.createConversation>
  ) {
    return this.transaction(
      "rw",
      this.messages,
      this.conversations,
      async () => {
        await this.conversations.update(conversationId, { title: args[0] });
        await this.messages.where({ conversationId }).delete();
        await this.messages.bulkAdd(
          args[1].map((message) => {
            return { ...message, conversationId };
          })
        );
        return conversationId;
      }
    );
  }
}

export const db = new ConvoDB();
