# Rem Waste (React + Tailwind)

## Redesign Section

### Phase 1: Identifying the Need for Redesign
The previous design, which utilized black and blue colors, did not align well with the theme of a waste management platform. The main colors are now white and green, which feel more appropriate for a waste management platform. Green is often associated with eco-friendliness and sustainability. The dark theme also felt out of place for a service related to waste management.

### Phase 2: Redesigning the Progress Bar
I redesigned the progress bar to include circles, which provide a clearer visual representation of the steps involved. This design choice enhances user experience by making the progress more intuitive. Additionally, I implemented a fade effect and centered the selected step on mobile devices to improve responsiveness and usability.

### Phase 3: Enhancing Skip Listings
I added a label to display the available skips and introduced more filters to help users find the right skip more easily. On desktop, these filters are presented as a dropdown, while on mobile, they appear in fullscreen mode to ensure a responsive design.

### Phase 4: Modernizing the Grid and Cards
The grid and cards are now responsive and feature a modern style. Instead of a single button, each card includes two buttons: "Select" and "Details". This gives users more options and prevents them from feeling constrained. The cards also display VAT information, and hovering over the price/VAT shows a breakdown of how the total is calculated, including any additional charges.

### Phase 5: Simplifying Features Display
Currently, the features section includes two options: road placement and heavy waste. This keeps the card design clean and uncluttered. However, this can be modified in the future to include more options, possibly with a "show more" feature.

### Phase 6: Detailed Information Modal
A simple card is often not enough to convince users to make a purchase. Therefore, I implemented a modal that provides more detailed information about each skip. This modal appears when users click on "Details" or "Continue" after selecting a skip. This ensures that users are fully informed about additional costs, transport fees, and other details before making a decision.

### Phase 7: Bottom Bar for Selected Skip
When a skip is selected, a bottom bar appears with details and pricing information. Clicking "Continue" will show the same modal with more details, ensuring that users are aware of all costs and options.

This approach ensures that the platform is not only visually appealing but also user-friendly and informative, ultimately leading to a better user experience and higher conversion rates.

## Codebase Section

### Componentization
To enhance the maintainability and scalability of the codebase, I broke down the application into smaller, reusable components. This approach allows for easier management of the code, as each component is responsible for a specific piece of functionality. For instance, the `SkipCard`, `Filters`, and `SkipDetailsModal` components each handle their respective parts of the UI. This modular design makes it easier to update or modify individual parts of the application without affecting the entire codebase.

### Custom Icons
I opted to use custom icons for several reasons. Firstly, custom icons ensure a consistent visual style across the application, which is crucial for maintaining a cohesive user experience. Secondly, by creating a custom icon component, I can easily manage and update the icons from a single place, reducing redundancy and potential inconsistencies. Additionally, custom icons can be optimized for performance, ensuring that they load quickly and do not negatively impact the user experience.

Overall, these design choices contribute to a more organized, efficient, and user-friendly application, aligning with the goals of the redesign to improve usability and visual appeal.
