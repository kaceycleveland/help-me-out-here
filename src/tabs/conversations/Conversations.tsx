import { Table } from "flowbite-react";
import { Link, useLoaderData } from "react-router-dom";
import { Conversation, db } from "../../api";
import { formatDate } from "../../utils/dateUtils";
import { PageAnimateLayout } from "../components/PageAnimateLayout";

export const conversationLoader = () => {
  return db.conversations.toCollection().toArray();
};

export const Conversations = () => {
  const conversations = useLoaderData() as Awaited<
    ReturnType<typeof conversationLoader>
  >;
  return (
    <PageAnimateLayout>
      <Table>
        <Table.Head>
          <Table.HeadCell>Conversation Name</Table.HeadCell>
          <Table.HeadCell>Created</Table.HeadCell>
          <Table.HeadCell>Updated</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {conversations.map((conversation) => {
            return (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {conversation.title}
                </Table.Cell>
                <Table.Cell>{formatDate(conversation.created)}</Table.Cell>
                <Table.Cell>{formatDate(conversation.updated)}</Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/conversations/${conversation.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </PageAnimateLayout>
  );
};
