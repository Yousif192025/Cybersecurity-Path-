const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // Define entry points for your application.
  // Webpack will start bundling from these files.
  entry: {
    main: './src/scripts/main.js', // Main application JavaScript
    styles: './src/styles/main.scss', // Main application SCSS/CSS
    pathwaysMain: './src/scripts/pathways/main.js', // JavaScript for general pathways logic
    // Adding a new entry point for specific diploma detail logic
    diplomaDetail: './src/scripts/pathways/diplomaDetail.js',
    // Uncomment the line below if you have a dedicated script for roadmap-builder
    // roadmapBuilder: './src/scripts/pathways/roadmap-builder.js',
    // Note: 'nav', 'analytics', 'pwa' were mentioned in chunks, but not as entries.
    // If these are separate JS files you need bundled, you'd add them here:
    // nav: './src/scripts/nav.js',
    // analytics: './src/scripts/analytics.js',
    // pwa: './src/scripts/pwa.js',
  },
  // Output configuration for the bundled files.
  output: {
    // The output directory for all bundled files.
    path: path.resolve(__dirname, '../docs'),
    // Naming convention for JavaScript bundles. [name] is the entry key, [contenthash] for caching.
    filename: 'assets/js/[name].[contenthash].js',
    // Public URL of the output directory when referenced in the browser.
    publicPath: '/',
    // Clean the output directory before emit. This is handled by CleanWebpackPlugin now,
    // so `clean: true` here is slightly redundant but harmless.
    clean: true,
  },
  // Rules for how different types of modules are treated.
  module: {
    rules: [
      // Rule for JavaScript files (uses Babel for transpilation)
      {
        test: /\.js$/,
        exclude: /node_modules/, // Exclude node_modules to speed up compilation
        use: 'babel-loader', // Use babel-loader for JS files
      },
      // Rule for SCSS and CSS files (extracts CSS into separate files)
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into separate files
          'css-loader', // Interprets @import and url() like import/require()
          'postcss-loader', // Processes CSS with PostCSS (e.g., autoprefixer)
          'sass-loader', // Compiles SASS/SCSS to CSS
        ],
      },
      // Rule for common image formats (PNG, SVG, JPG, JPEG, GIF, ICO)
      // Uses asset/resource type for direct output to assets/images
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]', // Output images to assets/images/
        },
      },
      // Rule for font files (woff, woff2, eot, ttf, otf)
      // Important for Font Awesome if you're not using it via CDN or SVG sprites directly
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]', // Output fonts to assets/fonts/
        },
      },
      // Rule for SVG files, specifically for situations where you might want to inline smaller SVGs
      // If your main image loader (above) handles SVGs well, this might be redundant or for specific cases.
      // The `asset/resource` type (used for other images) is generally preferred for SVGs too for simplicity.
      // If you specifically need inline SVG as data URLs for small files, `url-loader` or `asset/inline` is an option.
      // For general SVG files, `asset/resource` is usually sufficient and simpler.
      // I've kept it as `asset/resource` as it's the modern Webpack 5 way.
      // If you truly need `svg-url-loader` for some reason, ensure its `test` doesn't conflict.
      // For now, consolidating SVG handling under the main image rule.
    ],
  },
  // Webpack plugins to perform various tasks.
  plugins: [
    // Cleans the output directory before each build.
    new CleanWebpackPlugin(),

    // Extracts CSS into separate files.
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css', // Naming for CSS bundles
    }),

    // --- HTMLWebpackPlugin configurations for various pages ---

    // General pages
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      filename: 'index.html',
      chunks: ['main', 'styles'], // Chunks to inject into index.html
    }),

    // Pathways main page
    new HtmlWebpackPlugin({
      filename: 'pathways/index.html',
      template: './src/templates/pathways/index.html',
      // Added 'styles' chunk here, assuming pathways/index.html also uses main styles.
      // Also, if 'nav', 'analytics', 'pwa' are separate JS files, they need entries.
      chunks: ['main', 'styles', 'pathwaysMain'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/beginner.html',
      template: './src/templates/pathways/beginner.html',
      chunks: ['main', 'styles', 'pathwaysMain'], // Assuming main styles are needed
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/professional.html',
      template: './src/templates/pathways/professional.html',
      chunks: ['main', 'styles', 'pathwaysMain'], // Assuming main styles are needed
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/roadmap-builder.html',
      template: './src/templates/pathways/roadmap-builder.html',
      // If 'roadmapBuilder' entry is uncommented, you'd add it here.
      chunks: ['main', 'styles', 'pathwaysMain'], // Assuming main styles are needed
    }),

    // HtmlWebpackPlugin for diploma pages using a unified template
    // This is a great approach for consistent layouts!
    new HtmlWebpackPlugin({
      filename: 'pathways/tvtc-cs-diploma.html',
      template: './src/templates/pathways/tvtc-diploma-template.html', // Unified template
      // Ensure all necessary chunks are included. 'diplomaDetail' is new.
      // 'nav', 'analytics', 'pwa' should only be here if they are actual entry points.
      // If they are implicitly included by 'main', you don't need to list them.
      chunks: ['main', 'styles', 'pathwaysMain', 'diplomaDetail'],
      templateParameters: { // Passing simple data to the template
        diplomaName: 'دبلوم علوم الحاسب',
        diplomaDescription: 'مسار أكاديمي معتمد لتأهيل متخصصين في علوم الحاسب.',
        duration: 'سنتان',
        tvtcOfficialLink: 'https://www.tvtc.gov.sa/diploma-cs-link',
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'pathways/tvtc-cs-security.html',
      template: './src/templates/pathways/tvtc-diploma-template.html', // Unified template
      chunks: ['main', 'styles', 'pathwaysMain', 'diplomaDetail'], // Including diplomaDetail script
      templateParameters: { // Passing simple data to the template
        diplomaName: 'دبلوم الأمن السيبراني',
        diplomaDescription: 'مسار أكاديمي متخصص في حماية الأنظمة والبيانات من التهديدات السيبرانية.',
        duration: 'سنتان',
        tvtcOfficialLink: 'https://www.tvtc.gov.sa/diploma-cybersecurity-link',
      },
    }),

    // --- CopyWebpackPlugin for static assets ---

    new CopyWebpackPlugin({
      patterns: [
        // Copying specific image icons
        {
          from: path.resolve(__dirname, '../src/assets/images/icons'),
          to: path.resolve(__dirname, '../docs/assets/images/icons'),
        },
        // Copying the entire images directory (this might overlap with asset/resource, ensure no duplicates)
        // If your images are primarily handled by `asset/resource` loader, this might not be needed for all images.
        // It's useful for images not referenced directly in JS/CSS, like those loaded dynamically or in HTML.
        {
          from: path.resolve(__dirname, '../src/assets/images'),
          to: path.resolve(__dirname, '../docs/assets/images'),
          // Optional: ignore files handled by asset/resource to prevent duplicates
          // If you use `asset/resource` for ALL images, you might remove this rule.
          // Or filter it: ignore: ['*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.ico']
        },
        // Copying manifest.json for PWA
        {
          from: path.resolve(__dirname, '../src/manifest.json'),
          to: path.resolve(__dirname, '../docs'),
        },
        // Copying service-worker.js for PWA
        {
          from: path.resolve(__dirname, '../src/service-worker.js'),
          to: path.resolve(__dirname, '../docs'),
        },
        // Copying new JSON data files
        {
          from: path.resolve(__dirname, '../src/data'),
          to: path.resolve(__dirname, '../docs/assets/data'),
        },
      ],
    }),
  ],
  // Resolve extensions for easier module importing.
  resolve: {
    extensions: ['.js', '.scss', '.css'],
  },
};
