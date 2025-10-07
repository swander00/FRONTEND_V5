# Shared Components Documentation

## 🎯 Overview

This document provides comprehensive documentation for all shared components in the application. The shared component system is organized into three phases, each building upon the previous to create a cohesive, maintainable, and scalable UI component library.

## 📦 Component Categories

### Phase 1: High Priority Components
- **Badges**: Property status, type, and feature indicators
- **Buttons**: Interactive button elements with consistent styling
- **Overlays**: Status overlays for property cards

### Phase 2: Medium Priority Components  
- **Modals**: Standardized modal system with multiple variants
- **Cards**: Flexible card components for different use cases
- **Forms**: Form field and button standardization

### Phase 3: Low Priority Components
- **Icons**: Centralized icon system with consistent usage
- **Animations**: Animation system for smooth transitions
- **Theme**: Theme system for design tokens and consistency

---

## 🏷️ Badge Components

### PropertyBadge
Unified badge component for property-related indicators.

```typescript
import { PropertyBadge } from '@/components/shared';

<PropertyBadge 
  variant="status" 
  value="Sold" 
  size="md" 
  showIcon={true}
/>
```

**Props:**
- `variant`: 'status' | 'type' | 'open-house' | 'community' | 'media-count'
- `value`: string - The badge text
- `size`: 'sm' | 'md' | 'lg' - Badge size
- `showIcon`: boolean - Whether to show the icon
- `className`: string - Additional CSS classes

**Specialized Badges:**
- `OpenHouseBadge` - For open house dates
- `NewCommunityBadge` - For community names
- `NewTypeBadge` - For property types
- `MediaCountBadge` - For media count indicators

---

## 🔘 Button Components

### InteractiveButton
Base interactive button component with multiple variants.

```typescript
import { InteractiveButton } from '@/components/shared';

<InteractiveButton 
  variant="virtual-tour"
  onClick={handleClick}
  size="md"
  loading={false}
  disabled={false}
>
  Virtual Tour
</InteractiveButton>
```

**Props:**
- `variant`: 'virtual-tour' | 'like' | 'share' | 'action' | 'contact' | 'favorite' | 'external'
- `onClick`: () => void - Click handler
- `size`: 'sm' | 'md' | 'lg' - Button size
- `loading`: boolean - Loading state
- `disabled`: boolean - Disabled state
- `icon`: ReactNode - Custom icon
- `iconPosition`: 'left' | 'right' | 'only' - Icon position

**Specialized Buttons:**
- `VirtualTourButton` - For virtual tour actions
- `LikeButton` - For like/favorite actions
- `ShareButton` - For sharing actions
- `ContactButton` - For contact actions

---

## 🎭 Overlay Components

### StatusOverlay
Unified overlay component for property status indicators.

```typescript
import { StatusOverlay } from '@/components/shared';

<StatusOverlay 
  status="sold"
  size="md"
  showIcon={true}
/>
```

**Props:**
- `status`: 'sold' | 'leased' | 'removed' | 'unavailable'
- `size`: 'sm' | 'md' | 'lg' - Overlay size
- `showIcon`: boolean - Whether to show the icon
- `className`: string - Additional CSS classes

**Specialized Overlays:**
- `NewSoldOverlay` - For sold properties
- `NewLeasedOverlay` - For leased properties
- `NewRemovedOverlay` - For removed properties
- `NewUnavailableOverlay` - For unavailable properties

---

## 🪟 Modal Components

### BaseModal
Foundation modal component with consistent structure and behavior.

```typescript
import { BaseModal } from '@/components/shared';

<BaseModal
  open={open}
  onClose={onClose}
  title="Modal Title"
  description="Modal description"
  size="lg"
  loading={loading}
  disabled={disabled}
>
  <ModalContent />
</BaseModal>
```

**Props:**
- `open`: boolean - Modal visibility
- `onClose`: () => void - Close handler
- `title`: string - Modal title
- `description`: string - Modal description
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' - Modal size
- `loading`: boolean - Loading state
- `disabled`: boolean - Disabled state
- `showBackButton`: boolean - Show back button
- `onBack`: () => void - Back button handler
- `footer`: ReactNode - Custom footer content

**Specialized Modals:**
- `AuthModal` - For authentication flows
- `PropertyDetailsModal` - For property details
- `SettingsModal` - For settings and preferences

---

## 🃏 Card Components

### PropertyCard
Flexible card component with multiple variants.

```typescript
import { PropertyCard } from '@/components/shared';

<PropertyCard 
  variant="listing"
  hover={true}
  loading={false}
  onClick={handleClick}
>
  <CardContent />
</PropertyCard>
```

**Props:**
- `variant`: 'listing' | 'suggestion' | 'highlight' | 'contact' | 'compact'
- `hover`: boolean - Hover effects
- `loading`: boolean - Loading state
- `onClick`: () => void - Click handler
- `disabled`: boolean - Disabled state
- `className`: string - Additional CSS classes

**Specialized Cards:**
- `ListingCard` - For property listings
- `SuggestionCard` - For search suggestions
- `HighlightCard` - For featured content
- `ContactCard` - For contact information
- `CompactCard` - For compact displays

---

## 📝 Form Components

### FormField
Unified form field component with validation.

```typescript
import { FormField } from '@/components/shared';

<FormField
  type="email"
  value={email}
  onChange={setEmail}
  label="Email Address"
  required
  error={emailError}
  helperText="Enter your email address"
/>
```

**Props:**
- `type`: 'text' | 'email' | 'password' | 'tel' | 'search' | 'date'
- `value`: string - Field value
- `onChange`: (value: string) => void - Change handler
- `label`: string - Field label
- `required`: boolean - Required field
- `error`: string - Error message
- `helperText`: string - Helper text
- `placeholder`: string - Placeholder text
- `disabled`: boolean - Disabled state
- `icon`: ReactNode - Custom icon

**Specialized Fields:**
- `EmailField` - For email inputs
- `PasswordField` - For password inputs with visibility toggle
- `TextField` - For text inputs
- `PhoneField` - For phone number inputs
- `SearchField` - For search inputs

### FormButton
Standardized button component with states.

```typescript
import { FormButton } from '@/components/shared';

<FormButton
  type="submit"
  loading={loading}
  success={success}
  error={error}
  onClick={handleSubmit}
>
  Submit Form
</FormButton>
```

**Props:**
- `type`: 'submit' | 'button' | 'reset' - Button type
- `loading`: boolean - Loading state
- `success`: boolean - Success state
- `error`: boolean - Error state
- `onClick`: () => void - Click handler
- `disabled`: boolean - Disabled state
- `className`: string - Additional CSS classes

**Specialized Buttons:**
- `SubmitButton` - For form submissions
- `CancelButton` - For cancel actions
- `SaveButton` - For save actions
- `NextButton` - For navigation

---

## 🎨 Icon Components

### Icon
Centralized icon component with consistent usage.

```typescript
import { Icon } from '@/components/shared';

<Icon 
  name="home"
  size="md"
  color="blue-500"
  animated={false}
  spin={false}
/>
```

**Props:**
- `name`: IconName - Icon identifier
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' - Icon size
- `color`: string - Icon color
- `strokeWidth`: number - Stroke width
- `fill`: string - Fill color
- `animated`: boolean - Animation state
- `spin`: boolean - Spin animation
- `pulse`: boolean - Pulse animation
- `bounce`: boolean - Bounce animation

**Available Icons:**
- Navigation: home, search, menu, x, arrow-left, arrow-right
- Property: map-pin, calendar, camera, heart, share, play, star, building, bed, bath
- User: user, mail, phone, lock, eye, settings, log-out
- Actions: check, plus, minus, edit, trash, save, send, download, upload, refresh
- Status: info, alert, check-circle, x-circle, help

**Specialized Icons:**
- `PropertyIcon` - For property-related icons
- `ActionIcon` - For action-related icons
- `StatusIcon` - For status-related icons
- `NavigationIcon` - For navigation-related icons

---

## 🎬 Animation Components

### Animation
Base animation component for consistent transitions.

```typescript
import { Animation } from '@/components/shared';

<Animation
  type="fade"
  duration="normal"
  delay="short"
  trigger="hover"
  loop={false}
>
  <AnimatedContent />
</Animation>
```

**Props:**
- `type`: AnimationType - Animation type
- `duration`: 'fast' | 'normal' | 'slow' | 'slower' - Animation duration
- `delay`: 'none' | 'short' | 'medium' | 'long' - Animation delay
- `trigger`: 'hover' | 'focus' | 'click' | 'always' - Animation trigger
- `loop`: boolean - Loop animation
- `direction`: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' - Animation direction

**Available Animations:**
- Fade: fade, slide-up, slide-down, slide-left, slide-right
- Transform: scale, rotate, bounce, pulse, shake, wiggle
- Advanced: flip, zoom, glow, float, tilt

**Specialized Animations:**
- `FadeIn` - For fade-in effects
- `SlideUp` - For slide-up effects
- `Scale` - For scale effects
- `Bounce` - For bounce effects
- `Pulse` - For pulse effects
- `Shake` - For shake effects
- `Glow` - For glow effects
- `Float` - For float effects

---

## 🎨 Theme Components

### ThemeProvider
Theme context provider for consistent theming.

```typescript
import { ThemeProvider } from '@/components/shared';

<ThemeProvider defaultMode="system" defaultColorScheme="blue">
  <App />
</ThemeProvider>
```

**Props:**
- `defaultMode`: 'light' | 'dark' | 'system' - Default theme mode
- `defaultColorScheme`: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' - Default color scheme

### useTheme Hook
Hook for accessing theme context.

```typescript
import { useTheme } from '@/components/shared';

const { mode, colorScheme, setMode, setColorScheme, toggleMode } = useTheme();
```

**Returns:**
- `mode`: ThemeMode - Current theme mode
- `colorScheme`: ColorScheme - Current color scheme
- `setMode`: (mode: ThemeMode) => void - Set theme mode
- `setColorScheme`: (scheme: ColorScheme) => void - Set color scheme
- `toggleMode`: () => void - Toggle theme mode

### Themed Components
Theme-aware components that adapt to the current theme.

```typescript
import { ThemedButton, ThemedCard } from '@/components/shared';

<ThemedButton 
  variant="primary"
  size="md"
  onClick={handleClick}
>
  Themed Button
</ThemedButton>

<ThemedCard variant="elevated">
  <CardContent />
</ThemedCard>
```

**ThemedButton Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' - Button variant
- `size`: 'sm' | 'md' | 'lg' - Button size
- `onClick`: () => void - Click handler
- `disabled`: boolean - Disabled state

**ThemedCard Props:**
- `variant`: 'default' | 'elevated' | 'outlined' - Card variant

### Design Tokens
Utility functions for consistent design tokens.

```typescript
import { getSpacing, getTypography, getColor } from '@/components/shared';

const spacing = getSpacing('md'); // '1rem'
const typography = getTypography('lg'); // 'text-lg'
const color = getColor('blue', 500); // 'blue-500'
```

---

## 🚀 Usage Examples

### Complete Property Card with All Systems

```typescript
import { 
  PropertyCard, 
  PropertyBadge, 
  VirtualTourButton, 
  StatusOverlay,
  Icon,
  FadeIn,
  Scale
} from '@/components/shared';

<PropertyCard variant="listing" hover={true}>
  <FadeIn duration="normal" delay="short">
    <div className="relative">
      <img src={property.image} alt={property.title} />
      <StatusOverlay status="sold" size="md" />
    </div>
    
    <div className="p-4">
      <h3 className="text-lg font-semibold">{property.title}</h3>
      <p className="text-gray-600">{property.address}</p>
      
      <div className="flex items-center gap-2 mt-2">
        <PropertyBadge variant="type" value={property.type} size="sm" />
        <PropertyBadge variant="community" value={property.community} size="sm" />
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1">
          <Icon name="bed" size="sm" />
          <span>{property.bedrooms}</span>
        </div>
        
        <Scale trigger="hover">
          <VirtualTourButton 
            onClick={handleVirtualTour}
            icon={<Icon name="play" size="sm" />}
          />
        </Scale>
      </div>
    </div>
  </FadeIn>
</PropertyCard>
```

### Complete Form with Validation

```typescript
import { 
  AuthModal, 
  EmailField, 
  PasswordField, 
  SubmitButton, 
  CancelButton,
  Icon,
  FadeIn
} from '@/components/shared';

<AuthModal
  open={open}
  onClose={onClose}
  title="Sign In"
  description="Enter your credentials"
  loading={loading}
>
  <FadeIn duration="normal" delay="short">
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmailField
        value={email}
        onChange={setEmail}
        required
        error={emailError}
        helperText="Enter your email address"
        icon={<Icon name="mail" size="sm" />}
      />
      
      <PasswordField
        value={password}
        onChange={setPassword}
        required
        error={passwordError}
        helperText="Enter your password"
        icon={<Icon name="lock" size="sm" />}
      />
      
      <div className="flex space-x-3 pt-4">
        <CancelButton onClick={onClose} className="flex-1" />
        <SubmitButton 
          loading={loading}
          success={success}
          error={error}
          className="flex-1"
        >
          Sign In
        </SubmitButton>
      </div>
    </form>
  </FadeIn>
</AuthModal>
```

---

## 🎯 Best Practices

### 1. Component Composition
- Use specialized components when available
- Compose complex components from simpler ones
- Leverage the shared component system for consistency

### 2. Icon Usage
- Use the centralized Icon component for all icons
- Prefer semantic icon names over generic ones
- Use appropriate sizes for different contexts

### 3. Animation Guidelines
- Use subtle animations for better UX
- Avoid excessive animation on mobile devices
- Test animations across different devices and browsers

### 4. Theme Consistency
- Use theme-aware components when possible
- Leverage design tokens for consistent spacing and typography
- Test components in both light and dark modes

### 5. Performance
- Use lazy loading for heavy components
- Optimize animations for performance
- Test components with different data loads

---

## 🔧 Development Guidelines

### Adding New Components
1. Create the component in the appropriate category directory
2. Add proper TypeScript interfaces
3. Include comprehensive prop documentation
4. Add to the main index.ts export file
5. Update this documentation

### Testing Components
1. Test all prop combinations
2. Verify accessibility compliance
3. Test responsive behavior
4. Validate theme compatibility
5. Check animation performance

### Maintenance
1. Keep components up to date with design system changes
2. Monitor component usage across the application
3. Refactor components when patterns emerge
4. Document breaking changes and migration paths

---

## 📚 Additional Resources

- **Component Inventory**: `COMPONENT_INVENTORY.md`
- **Reorganization Summary**: `COMPONENT_REORGANIZATION_SUMMARY.md`
- **Phase 1 Implementation**: `PHASE_1_IMPLEMENTATION_SUMMARY.md`
- **Phase 2 Implementation**: `PHASE_2_IMPLEMENTATION_SUMMARY.md`
- **Phase 3 Implementation**: `PHASE_3_IMPLEMENTATION_SUMMARY.md`

This documentation provides a comprehensive guide to using the shared component system effectively. For questions or contributions, please refer to the development team or create an issue in the project repository.
