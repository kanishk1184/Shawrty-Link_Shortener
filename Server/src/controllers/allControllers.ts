import type { Request, Response } from "express";
import type { Iurl } from "../models/Url";
import URL from "../models/Url";
import generatePath from "../util/generatePath";

interface UrlReq extends Request {
    body: {
        url: string;
    };
}

// Create Link Controller
export const createLink = async (req: UrlReq, res: Response): Promise<void> => {
    try {
        const { url }: { url: string } = req.body;
        if (!url) {
            res.status(400).json({ message: "Url is required" });
            return;
        }
        
        // Check if this url already exists in the db
        const existingUrl: Iurl | null = await URL.findOne({ url });
        if (existingUrl) {
            res.status(200).json({ shortenUrl: existingUrl.shortenUrl });
            return;
        }
        
        // Create a new shortened url
        const idx: number = await URL.countDocuments();
        const path: string = generatePath(idx);
        const baseUrl: string = `${req.protocol}://${req.get("host")}`
        const shortenUrl: string = `${baseUrl}/${path}`

        const newUrl: Iurl = new URL({
            idx,
            url,
            shortenUrl
        });
        await newUrl.save();

        res.status(201).json({ shortenUrl });

    } catch (err: unknown) {
        res.status(500).json({ message: "Server error generating shortened url" });
    }
};

// Get Link Controller
export const getLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const { path } = req.params;
        const baseUrl: string = `${req.protocol}://${req.get("host")}`
        const shortenUrl: string = `${baseUrl}/${path}`
        
        // Find the actual url for this shortened url
        const urlDoc: Iurl | null = await URL.findOne({ shortenUrl });
        if (urlDoc === null) {
            res.status(404).send("Wrong Link!!!");
            return;
        }

        // Navigate to the actual url
        const actualUrl: string = urlDoc.url;
        res.redirect(actualUrl);
        
    } catch (err: unknown) {
        res.status(500).json({ message: "Server error!!" });
    }
};