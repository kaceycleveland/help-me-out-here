import { Link, useLoaderData } from "react-router-dom";
import { db } from "../../api";
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
      <table className="table-auto mt-2 bg-slate-50 border-collapse border w-full text-left font-light">
        <thead className="border-b font-medium">
          <th className="px-2 py-2">Conversation Name</th>
          <th className="px-2 py-2">Created</th>
          <th className="px-2 py-2">Updated</th>
          <th className="px-2 py-2">
            <span className="sr-only">Edit</span>
          </th>
        </thead>
        <tbody>
          {conversations.map((conversation) => {
            return (
              <tr className="bg-white">
                <td className="whitespace-nowrap font-medium text-gray-900 p-2">
                  {conversation.title}
                </td>
                <td className="p-2">{formatDate(conversation.created)}</td>
                <td className="p-2">{formatDate(conversation.updated)}</td>
                <td className="p-2">
                  <Link
                    to={`/conversations/${conversation.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </PageAnimateLayout>
  );
};
