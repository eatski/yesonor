import { refineQuestionLogs } from "@/server/services/questionLogs";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") {
		res.status(405).json({ message: "Method Not Allowed" });
		return;
	}
	if (
		!req.headers.authorization ||
		req.headers.authorization !== process.env.BATCH_API_KEY
	) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}
	try {
		const count = await refineQuestionLogs();
		res.status(200).json({ count });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export default handler;