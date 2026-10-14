
# Beginner's Guide to Customizing Your Website

Welcome! This guide will help you understand how to make basic changes to your new website. We've simplified the code and added comments to make it as easy as possible.

---

## 1. How to Change Colors

We use **CSS Variables** to manage colors. This means you only have to change a color in one place, and it updates everywhere!

**Where to look:** Open `apps/web/src/styles/variables.css`

**How to change the main accent color (currently Cyan):**
1. Find the line that says `--primary: 190 100% 50%;`
2. The numbers represent HSL (Hue, Saturation, Lightness).
3. To change it to **Neon Green**, change it to: `--primary: 120 100% 50%;`
4. To change it to **Hot Pink**, change it to: `--primary: 330 100% 60%;`

*Tip: You can use an online "HSL Color Picker" to find the exact numbers for the color you want.*

---

## 2. How to Change Text and Content

The text you see on the screen is written directly inside the React components (the `.jsx` files).

**Example: Changing the Home Page Hero Text**
1. Open `apps/web/src/pages/HomePage.jsx`
2. Scroll down until you see the `<h1>` tag.
3. You will see: `Elevate your sound with`
4. Simply delete that text and type your own! For example: `Make better music with`
5. Save the file, and the website will update instantly.

---

## 3. How to Modify Layout and Spacing

We created simple CSS files for the main pages so you can easily adjust layouts without learning complex frameworks.

**Where to look:** 
- `apps/web/src/styles/home.css` (For the home page)
- `apps/web/src/styles/products.css` (For the products page)

**Example: Changing the space between product cards**
1. Open `products.css`
2. Find the `.product-grid` section.
3. Look for `gap: 2rem;`
4. Change it to `gap: 1rem;` to make them closer together, or `gap: 4rem;` to spread them further apart.

---

## 4. How to Add New Products

Your products are stored in a database called **PocketBase**. You don't need to write code to add products!

1. Ask the AI Assistant to "Open the PocketBase Admin Dashboard".
2. Click on the **"products"** collection on the left sidebar.
3. Click the **"New Record"** button at the top right.
4. Fill in the details:
   - `name`: The title of your product (e.g., "Cyberpunk Synth Pack")
   - `price`: The cost (e.g., 29.99)
   - `category`: Select from the dropdown
   - `productImage`: Upload a cover image
5. Click **Save**. The product will instantly appear on your website's Catalog page!

---

## 5. How to Customize the Hero Section Image

The large background image on the home page is set in the CSS.

1. Open `apps/web/src/styles/home.css`
2. Find the `.home-hero-bg` section.
3. Look for the line: `background-image: url('https://images.unsplash.com/photo-1627975399961-e88bde8a7648');`
4. Replace the URL inside the quotes with a link to any image you want to use.
5. Save the file!

*Tip: If your new image is too bright and makes the text hard to read, you can adjust the `filter: brightness(0.4)` line in the same section. Lower numbers make it darker.*
