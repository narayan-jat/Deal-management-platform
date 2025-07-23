# CreateDealCard Component

A responsive, accessible React component for creating new deals in a CRM dashboard layout.

## Features

- **Slide-out Form**: Slides in from the right side of the screen
- **Responsive Design**: Adapts to different screen sizes with proper mobile support
- **Accessibility**: Full keyboard navigation, ARIA labels, and focus management
- **Form Validation**: Client-side validation with visual feedback
- **Tag Management**: Add/remove tags with chip/pill UI
- **Date & Time Selection**: Calendar inputs for dates and meetings
- **Collaborator Invitation**: Modal popup for inviting team members
- **Modern UI**: Clean design with Tailwind CSS styling

## Props

```typescript
interface CreateDealCardProps {
  isOpen: boolean;           // Controls visibility of the form
  onClose: () => void;       // Callback when form is closed
  onSubmit?: (deal: DealData) => void; // Callback when form is submitted
}

interface DealData {
  title: string;           // Deal title (required)
  value: string;           // Deal value (optional)
  stage: string;           // Deal stage (required)
  tags: string[];          // Array of tags
  notes: string;           // Additional notes
  startDate: string;       // Start date (optional)
  endDate: string;         // End date (optional)
  nextMeeting: string;     // Next meeting date/time (optional)
  industry: string;        // Industry (optional)
  location: string;        // Location (optional)
  collaborators: string[]; // Array of collaborator emails
}
```

## Usage

```tsx
import { useState } from "react";
import CreateDealCard from "./CreateDealCard";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (deal: DealData) => {
    console.log("New deal:", deal);
    // Handle deal creation (API call, etc.)
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Create Deal
      </button>
      
      <CreateDealCard
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

## Form Fields

1. **Deal Title** (Required)
   - Text input for the deal name
   - Validation ensures it's not empty

2. **Deal Value** (Optional)
   - Number input with currency prefix ($)
   - Supports decimal values

3. **Stage** (Required)
   - Dropdown with predefined stages:
     - Lead
     - Qualified
     - Proposal Sent
     - Won
     - Lost

4. **Industry** (Optional)
   - Dropdown with common industries:
     - Technology, Healthcare, Finance, Education, Manufacturing
     - Retail, Real Estate, Consulting, Marketing, Other

5. **Location** (Optional)
   - Text input with location icon
   - Free-form location entry

6. **Date Range** (Optional)
   - **Start Date**: Date picker with calendar icon
   - **End Date**: Date picker with calendar icon
   - Side-by-side layout on desktop

7. **Next Meeting** (Optional)
   - Date and time picker with calendar icon
   - Supports both date and time selection

8. **Tags** (Optional)
   - Multi-select with chip/pill UI
   - Add tags by typing and pressing Enter or clicking the + button
   - Remove tags by clicking the X on each tag

9. **Collaborators** (Optional)
   - Invite button opens a modal popup
   - Enter multiple email addresses (comma or newline separated)
   - Email validation and duplicate prevention
   - Remove collaborators with X button

10. **Notes** (Optional)
    - Multi-line textarea for additional information
    - Resizable with minimum height

## Collaborator Invitation Modal

The component includes a built-in modal for inviting collaborators:

- **Email Input**: Textarea for multiple email addresses
- **Validation**: Basic email format validation
- **Parsing**: Supports comma and newline separation
- **Duplicate Prevention**: Automatically filters out duplicates
- **Accessibility**: Full keyboard navigation and ARIA support

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all form elements
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Focus rings and logical tab order
- **Error Messages**: Clear error indicators with proper ARIA attributes
- **Loading States**: Disabled states during form submission
- **Modal Management**: Proper focus trapping and escape key handling

## Responsive Behavior

- **Desktop**: Full-width slide-out panel (max-width: 448px)
- **Tablet**: Responsive padding and spacing
- **Mobile**: Stacked layout with touch-friendly buttons
- **Backdrop**: Click outside to close (when not submitting)
- **Date Grid**: Responsive grid for date fields

## Styling

The component uses Tailwind CSS classes and follows the existing design system:
- Consistent with other UI components in the project
- Uses the `cn` utility for class merging
- Follows the color scheme and spacing patterns
- Icons from Lucide React for visual consistency

## Dependencies

- React 18+
- Tailwind CSS
- Lucide React (for icons)
- Radix UI (for Select component)
- class-variance-authority (for button variants)

## Demo

See `CreateDealCardDemo.tsx` for a complete example of how to integrate the component into a CRM dashboard layout, including display of all the new fields in the deal cards. 