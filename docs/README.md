# CargoFlow developer documentation

[Project overview](../README.md)

This documentation describes the template as it is implemented. Follow the guides in order for a first setup, or use the task index to find the files relevant to a change.

## Guides

| Guide | What you will learn |
| --- | --- |
| [Getting started](getting-started.md) | Requirements, installation, environment configuration, development commands and first-run checks. |
| [Project structure](project-structure.md) | Routes, folders, component responsibilities, dependencies and generated files. |
| [Customization and reuse](customization.md) | Rebranding, changing homepage sections, navigation, assets, typography and reusing components. |
| [Internal pages](internal-pages.md) | Manifest-based routing, shared layouts, adding pages, content updates, search and reference imports. |
| [Forms and inquiry API](forms-and-api.md) | Multi-step forms, field conventions, attachments, webhook configuration and response behavior. |
| [Animation guide](animations.md) | The video hero, smooth scrolling, globe animation and changes that affect their behavior. |
| [Testing and troubleshooting](testing-and-troubleshooting.md) | Existing checks, browser setup, test coverage and solutions to common problems. |
| [Deployment](deployment.md) | Building and serving the application, runtime requirements and production configuration. |
| [Reference motion measurements](reference-motion.md) | Recorded frame ranges, easing, scroll offsets and visual comparison measurements. |

## Find documentation by task

| I want to… | Start here |
| --- | --- |
| Run the template locally | [Install and start](getting-started.md#install-and-start). |
| Understand why the project contains HTML as well as TSX | [Two rendering paths](project-structure.md#two-rendering-paths). |
| Replace the branding | [Rebrand the template](customization.md#rebrand-the-template). |
| Change a menu or service link | [Navigation and links](customization.md#navigation-and-links). |
| Add a service, news or location page | [Add a template-backed page](internal-pages.md#add-a-template-backed-page). |
| Add a custom React page | [Add a React page](internal-pages.md#add-a-react-page). |
| Change a freight form field | [Change or add fields](forms-and-api.md#change-or-add-fields). |
| Send inquiries to my own backend | [Connect a delivery endpoint](forms-and-api.md#connect-a-delivery-endpoint). |
| Replace the hero video | [Replace the video](animations.md#replace-the-video). |
| Use only a section of the homepage | [Reuse individual components](customization.md#reuse-individual-components). |
| Diagnose a broken layout or missing route | [Troubleshooting](testing-and-troubleshooting.md#troubleshooting). |
| Publish the application | [Deployment requirements](deployment.md#deployment-requirements). |

## Documentation scope

The template includes an animated logistics homepage, 177 local English internal pages and inquiry forms. It does not include a CMS administration interface, shipment tracking backend, customer account system or built-in email delivery. Those services are either external links or integrations that the application owner configures.

All setup commands are intended to be run from the repository root unless a guide says otherwise. Paths in the guides are relative to that root. Examples show how a developer can extend the existing implementation; they are not changes already applied to the template.

The reference design is [Emons](https://www.emons.de/en). Asset inventories retain the original source URLs. Review the branding and asset provenance when adapting the project for a different organization; this repository does not contain an asset license granting third-party reuse.
