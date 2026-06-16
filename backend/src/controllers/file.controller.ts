import { PDFDocument } from "pdf-lib";
import axios from "axios";
import { File } from "../models/file.model.js";

export const downloadFile =
    async (
        req: any,
        res: any,
    ) => {
        try {
            const file =
                await File.findById(
                    req.params.id
                );

            if (!file) {
                return res
                    .status(404)
                    .json({
                        success: false,
                    });
            }
            if (!file.fileUrl) {
                return res.status(400).json({
                    success: false,
                    message:
                        "File URL not found",
                });
            }
            const response =
                await fetch(
                    file.fileUrl
                );

            const buffer =
                Buffer.from(
                    await response.arrayBuffer()
                );

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${file.fileName}"`
            );

            res.setHeader(
                "Content-Type",
                file.fileType
            );

            return res.send(
                buffer
            );
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                });
        }
    };



export const compressPdf =
    async (
        req: any,
        res: any
    ) => {
        try {
            const file =
                await File.findById(
                    req.params.id
                );

            if (!file) {
                return res.status(404).json({
                    success: false,
                });
            }

            if (!file.fileUrl) {
                return res.status(400).json({
                    success: false,
                    message:
                        "File URL not found",
                });
            }
            const pdfBytes =
                await axios
                    .get(
                        file.fileUrl,
                        {
                            responseType:
                                "arraybuffer",
                        }
                    )
                    .then(
                        (r) => r.data
                    );

            const pdfDoc =
                await PDFDocument.load(
                    pdfBytes
                );

            const compressed =
                await pdfDoc.save({
                    useObjectStreams: true,
                });

            res.setHeader(
                "Content-Disposition",
                `attachment; filename=compressed_${file.fileName}`
            );

            res.setHeader(
                "Content-Type",
                "application/pdf"
            );

            return res.send(
                Buffer.from(
                    compressed
                )
            );
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
            });
        }
    };