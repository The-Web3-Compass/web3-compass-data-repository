**Contribution Guide: Communities**

Welcome to the Communities section of the Web3 Compass repository! This folder houses information about various Web3 communities, serving as a valuable resource for those looking to connect and engage within the ecosystem. We appreciate your interest in contributing to this knowledge base. Please follow this guide to ensure your contributions align with our standards.

* * * * *

### Table of Contents

1.  [Folder Structure](#folder-structure)
2.  [Contributing a New Community](#contributing-a-new-community)
3.  [Updating an Existing Community](#updating-an-existing-community)
4.  [Formatting Guidelines](#formatting-guidelines)
5.  [Pull Request Process](#pull-request-process)
6.  [Code of Conduct](#code-of-conduct)

* * * * *

### Folder Structure

The communities folder contains JSON files for various Web3 communities, each named after the respective community (e.g., `bankless.json`, `developerdao.json`).

**JSON Structure**

Each JSON file follows this structure:



```json
{
  "name": "Community Name",
  "description": "A brief description of the community and its focus.",
  "location": "City or 'Global' if the community is online-based.",
  "members": "Approximate number of members (e.g., '100+', '5000+')",
  "focus": "Comma-separated list of the community's focus areas (e.g., 'DeFi, DAOs, NFTs')",
  "socials": {
    "website": "[invalid URL removed]",
    "twitter": "[invalid URL removed]",
    "discord": "[invalid URL removed]",
    # Add other relevant social media links as needed
  }
}
```

* * * * *

### Contributing a New Community

If you'd like to add a new community listing:

1.  **Fork the Repository**: Start by forking this repository to your GitHub account.
2.  **Create a New JSON File**: Create a new JSON file in the `communities` folder, named after the community (e.g., `new-community.json`). Use kebab-case for the filename.
3.  **Follow the JSON Structure**: Use the template provided above to structure your JSON file.
4.  **Fill in Community Details**: Provide accurate and up-to-date information about the community, including its name, description, location, member count, focus areas, and social media links.
5.  **Check for Duplicates**: Verify that the community you're adding is not already included in the folder.
6.  **Update the Index**: Add an entry for your new community to the `communities/index.json` file, ensuring it is sorted alphabetically.

* * * * *

### Updating an Existing Community

To update or improve an existing community listing:

1.  **Find the Relevant JSON File**: Locate the JSON file you want to update in the `communities` folder.
2.  **Update Information**: Make the necessary changes to the file, ensuring the information is accurate and up-to-date.
3.  **Describe Your Changes**: Provide a clear description of the changes you've made in your pull request, including why the changes were necessary.

* * * * *

### Formatting Guidelines

To maintain consistency:

-   **File Names**: Use kebab-case for community JSON filenames (e.g., `my-community.json`).
-   **JSON Formatting**: Ensure your JSON files are properly formatted and easy to read. Use 2 spaces for indentation.
-   **Accuracy**: Double-check all information for accuracy before submitting.
-   **Completeness**: Include all relevant social media links and focus areas for the community.
-   **Neutrality**: Keep descriptions objective and avoid promotional language.

* * * * *

### Pull Request Process

1.  **Create a Pull Request**: Once you've made your changes, create a pull request (PR) from your fork to this repository's main branch.
2.  **Provide a Description**: In your PR description, include a summary of the changes, along with any relevant context or reasoning.
3.  **Review and Feedback**: A maintainer will review your submission and may request changes or provide feedback.
4.  **Approval and Merge**: Once your PR is approved, it will be merged into the repository.

* * * * *

### Code of Conduct

We are committed to maintaining a positive and inclusive environment for our contributors. Please review our Code of Conduct before contributing to ensure your behavior aligns with our community guidelines.

* * * * *

Please let me know if you have any other questions. Happy contributing!
