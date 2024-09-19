Contribution Guide: Starter Packs
=================================

Welcome to the **Starter Packs** section of the Web3 Compass repository! This folder houses curated resources for various blockchain protocols to help developers, enthusiasts, and researchers get started with specific technologies. We appreciate your interest in contributing to this knowledge base. Please follow this guide to ensure your contributions align with our standards.

Table of Contents
-----------------

1.  [Folder Structure](#folder-structure)
2.  [Contributing a New Starter Pack](#contributing-a-new-starter-pack)
3.  [Updating an Existing Starter Pack](#updating-an-existing-starter-pack)
4.  [Formatting Guidelines](#formatting-guidelines)
5.  [Pull Request Process](#pull-request-process)
6.  [Code of Conduct](#code-of-conduct)

Folder Structure
----------------

The `starterpacks` folder contains JSON files for various blockchain protocols, each named after the respective protocol (e.g., `ethereum.json`, `polkadot.json`). Each file contains a structured list of resources categorized by experience level: **Beginner**, **Intermediate**, and **Advanced**.


### JSON Structure

Each JSON file follows this structure:

### JSON Structure
Each JSON file follows this structure:

```json
{
  "id": "protocol-name",
  "name": "Protocol Name",
  "description": "A brief description of the protocol.",
  "resources": [
    {
      "level": "Beginner",
      "items": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "description": "A brief description of the resource."
        }
      ]
    },
    {
      "level": "Intermediate",
      "items": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "description": "A brief description of the resource."
        }
      ]
    },
    {
      "level": "Advanced",
      "items": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "description": "A brief description of the resource."
        }
      ]
    }
  ]
}

Contributing a New Starter Pack
-------------------------------

If you'd like to add a starter pack for a new protocol:

1.  **Fork the Repository**: Start by forking this repository to your GitHub account.
2.  **Create a New JSON File**: Create a new JSON file in the `starterpacks` folder, named after the protocol (e.g., `solana.json`).
3.  **Follow the JSON Structure**: Use the template provided above to structure your JSON file.
4.  **Fill in Resource Details**: Include relevant resources under the categories `Beginner`, `Intermediate`, and `Advanced`. Ensure the information is accurate and up-to-date.
5.  **Check for Duplicates**: Verify that the resources you're adding are not already included in other starter packs.

Updating an Existing Starter Pack
---------------------------------

To update or improve an existing starter pack:

1.  **Find the Relevant JSON File**: Locate the JSON file you want to update in the `starterpacks` folder.
2.  **Add/Remove Resources**: Add new resources or update/remove outdated ones, following the formatting guidelines below.
3.  **Describe Your Changes**: Provide a clear description of the changes you've made in your pull request, including why the changes were necessary.

Formatting Guidelines
---------------------

To ensure consistency across all starter packs, please adhere to the following guidelines:

-   **Resource Levels**: Always categorize resources as `Beginner`, `Intermediate`, or `Advanced`.
-   **Resource Titles**: Use concise and descriptive titles for each resource.
-   **URLs**: Ensure all URLs are valid and accessible.
-   **Descriptions**: Keep descriptions brief (1-2 sentences) and informative.
-   **No Affiliates**: Do not include affiliate links or promotional content.

Pull Request Process
--------------------

1.  **Create a Pull Request**: Once you've made your changes, create a pull request (PR) from your fork to this repository's `main` branch.
2.  **Provide a Description**: In your PR description, include a summary of the changes, along with any relevant context or reasoning.
3.  **Review and Feedback**: A maintainer will review your submission and may request changes or provide feedback.
4.  **Approval and Merge**: Once your PR is approved, it will be merged into the repository.

Code of Conduct
---------------

We are committed to maintaining a positive and inclusive environment for our contributors. Please review our Code of Conduct before contributing to ensure your behavior aligns with our community guidelines.
