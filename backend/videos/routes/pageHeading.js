const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authmiddleware');
const { uploadLogo } = require("../middleware/logoUpload")

const { getpageHeading, updatePageHeading } = require('../controller/pageHeading')

router.get('/heading', getpageHeading,);
router.put('/updateHeading', requireAuth, uploadLogo, updatePageHeading);

/**
 * @swagger
 * tags:
 *   name: PageHeadings
 *   description: API for managing page headings
 */

/**
 * @swagger
 * /api/heading:
 *   get:
 *     summary: Retrieve a page heading
 *     tags: [PageHeadings]
 *     parameters:
 *       - in: query
 *         name: pageType
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the page to retrieve the heading for
 *     responses:
 *       200:
 *         description: Successfully retrieved page heading
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 heading:
 *                   type: string
 *                   description: The heading of the page
 *                 subheading:
 *                   type: string
 *                   description: The subheading of the page
 *       404:
 *         description: Page heading not found
 *       500:
 *         description: Error retrieving page heading
 */

/**
 * @swagger
 * /api/updateHeading:
 *   put:
 *     summary: Update or create a page heading
 *     tags: [PageHeadings]
 *     parameters:
 *       - in: query
 *         name: pageType
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the page to update or create the heading for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heading:
 *                 type: string
 *                 description: The heading to update or create
 *               subheading:
 *                 type: string
 *                 description: The subheading to update or create
 *     responses:
 *       200:
 *         description: Successfully updated page heading
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 heading:
 *                   type: string
 *                   description: The updated heading of the page
 *                 subheading:
 *                   type: string
 *                   description: The updated subheading of the page
 *       201:
 *         description: Page heading created successfully
 *       500:
 *         description: Error updating page heading
 */


module.exports = router;