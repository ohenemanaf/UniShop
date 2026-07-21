/**
 * File: SEO.jsx
 * Description: Auto-generated documentation for SEO.jsx
 * Date: 2026-07-21
 */
import { Helmet } from 'react-helmet-async';
export default /**
 * Function SEO
 * @param {any} props
 * @returns {any}
 */
function SEO({
  title = 'UniShop | Premium E-Commerce',
  description = 'Shop the Future, Delivered Today. Discover thousands of premium products across tech, fashion, home & more.',
  image = 'https://via.placeholder.com/1200x630?text=UniShop',
  url = window.location.href
}) {
  return <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OpenGraph tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>;
}