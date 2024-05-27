---
title: DScreen Component Documentation
---

`DScreen` is a versatile React component designed for creating complex screen layouts with vertical and horizontal bars and a content area. This documentation provides an in-depth guide on how to use the `DScreen` component and its subcomponents.

## Installation

Import the `DScreen` component into your project:

```javascript
import {DScreen} from '@code0-tech/pictor';
```

## Usage

The `DScreen` component and its subcomponents can be used to create various screen layouts. Below are some examples illustrating different configurations.

### Example: Basic Layout

```jsx
import {DScreen} from '@code0-tech/pictor';

const App = () => (
  <DScreen>
    <DScreen.VBar.Top>
      <DScreen.Item>
        Top Item Content
      </DScreen.Item>
    </DScreen.VBar.Top>
    <DScreen.VBar.Bottom>
      <DScreen.Item>
        Bottom Item Content
      </DScreen.Item>
    </DScreen.VBar.Bottom>
    <DScreen.HBar.Left>
      <DScreen.Item>
        Left Item Content
      </DScreen.Item>
    </DScreen.HBar.Left>
    <DScreen.HBar.Right>
      <DScreen.Item>
        Right Item Content
      </DScreen.Item>
    </DScreen.HBar.Right>
    <DScreen.Content>
      Main Content Area
    </DScreen.Content>
  </DScreen>
);

export default App;
```

## Component API

### DScreen

The main container component.

#### Props

- `children` (required): An array of `React.ReactElement` containing `VBar`, `HBar`, `Content`, and `Item` components.

#### Example

```jsx
<DScreen>
  {/* Children elements go here */}
</DScreen>
```

### VBar

A vertical bar component. Can be either `Top` or `Bottom`.

#### Props

- `children`: Content to be displayed inside the vertical bar.

#### Example

```jsx
<DScreen.VBar.Top>
  <DScreen.Item>
    Top Bar Item Content
  </DScreen.Item>
</DScreen.VBar.Top>
```

### HBar

A horizontal bar component. Can be either `Left` or `Right`.

#### Props

- `children`: Content to be displayed inside the horizontal bar.

#### Example

```jsx
<DScreen.HBar.Left>
  <DScreen.Item>
    Left Bar Item Content
  </DScreen.Item>
</DScreen.HBar.Left>
```

### Content

The main content area component.

#### Props

- `children`: Content to be displayed inside the main content area.

#### Example

```jsx
<DScreen.Content>
  Main Content Area
</DScreen.Content>
```

### Item

A span element component, used for displaying items within the layout.

#### Props

- `children`: Content to be displayed inside the item.
- `active` (optional): A boolean indicating if the item is active. Defaults to `false`.

#### Example

```jsx
<DScreen.Item active={true}>
  Active Item Content
</DScreen.Item>
```

## Summary

`DScreen` is a powerful component for creating structured layouts with vertical and horizontal bars. By combining `VBar`, `HBar`, `Content`, and `Item` components, you can achieve a wide variety of layouts to suit your application's needs.