// import { transactions } from './../../../db/schema';
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useSearchParams } from "@/node_modules/next/navigation";
import { useQuery } from "@tanstack/react-query";


export const useGetTransactions = () => {

    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({
        //TODO:
        queryKey: [ "transactions", { from, to, accountId} ],
        queryFn: async () => {
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId,
                },
            });

            if(!response.ok) {
                throw new Error("Failed to Fetch transactions");
            }

            const { data } = await response.json();
            return data.map((transaction) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount),
            }));
        }
    });
    return query;
};