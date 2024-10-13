// // pages/api/upload.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// // import { cloudinary } from 'next-cloudinary';
// import { CloudinaryLoader } from 'next-cloudinary';

// interface UploadRequest extends NextApiRequest {
//   body: {
//     imageUrl: string;
//   };
// }

// export default async function handler(req: UploadRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { imageUrl } = req.body;

//     try {
//       const result = await cloudinary.uploader.upload(imageUrl, {
//         folder: 'github_profiles', // Optional: specify a folder
//       });

//       res.status(200).json({ url: result.secure_url });
//     } catch (error) {
//       console.error('Upload error:', error);
//       res.status(500).json({ error: 'Failed to upload image' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
