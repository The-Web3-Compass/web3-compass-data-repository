# Web3 Compass Data Directory

Welcome to the data repository for Web3 Compass, the biggest web3 community directory and resource hub for developers transitioning into the web3 ecosystem.

## Project Overview

Web3 Compass aims to be a comprehensive guide for web2 developers looking to explore and contribute to the world of web3. Our platform provides curated resources, community listings, and starter packs for various blockchain protocols.

## Data Structure

This repository contains the following data folders:

### `/communities`

This folder contains JSON files for individual web3 communities. Each file represents a single community and includes details such as:

- Community name

- Description

- Location

- Website

- Social media links

- Focus areas

The `index.json` file in this folder serves as a directory of all communities.

### `/explainers`

This folder contains subfolders for each explainer topic. Each subfolder includes:

- `content.html`: The main content of the explainer in HTML format

- Any additional assets (images, scripts, etc.) used in the explainer

The structure looks like this:

```

/explainers

  /blockchain-basics

    content.html
    
    /img

       blockchain-diagram.png

  /smart-contracts

    content.html
  ...

```

The `index.json` file in the main `/explainers` folder serves as a table of contents for all explainer topics.

### `/starterpacks`

This folder contains JSON files for starter packs tailored to different blockchain protocols. Each file represents a starter pack and includes:

- Protocol name

- Description

- Learning resources (categorized by difficulty level)

- Key tools and frameworks

- Community resources

The `index.json` file in this folder serves as a directory of all available starter packs.

## Contribution Guidelines

We welcome contributions from the community to help make Web3 Compass a comprehensive and up-to-date resource. Please follow these guidelines when contributing:

1\. **Fork and Clone**: Always fork the repository and clone it to your local machine to make changes.

2\. **Branch**: Create a new branch for each feature or update you're working on.

3\. **Pull Requests**: All contributions should be made via pull requests (PRs). Direct pushing to the main branch is not allowed.

4\. **Review**: All PRs require review before merging. Please be patient and be prepared to make changes if requested.

5\. **Style**: 

   - Ensure your JSON files are properly formatted. Use 2 spaces for indentation.

   - For HTML files, use consistent indentation and follow HTML5 standards.

6\. **Naming Convention**: 

   - For communities: `community-name.json`

   - For explainers: Use kebab-case for folder names, e.g., `blockchain-basics`

   - For starter packs: `protocol-name.json`

7\. **Content Guidelines**:

   - Ensure all information is accurate and up-to-date.

   - Avoid promotional or biased content.

   - For explainers, focus on educational value and ensure the HTML is well-structured and accessible.

8\. **Updates**: If you're updating existing data, please provide a brief explanation of the changes in your PR description.

9\. **New Entries**: 

   - When adding new communities or starter packs, remember to update the respective `index.json` file.

   - For new explainers, create a new folder with an `index.html` file and update the main `explainers/index.json`.

10\. **Code of Conduct**: Please adhere to our Code of Conduct in all your interactions with the project.

## Questions or Suggestions?

If you have any questions about contributing or suggestions for improving Web3 Compass, please open an issue in this repository. We appreciate your input and look forward to building the best resource for the web3 community together!

Thank you for contributing to Web3 Compass!
