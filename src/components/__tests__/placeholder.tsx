/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'
import * as stories from '../../stories/placeholder.stories'

const { StreamPlaceholder } = composeStories(stories)

const testIdLocators = {
  placeholderWrapper: 'placeholder',
  placeholderItem: 'placeholder-item',
}

describe('Component: Placeholder', () => {
  it('renders Stream placeholder with 5 items', () => {
    render(<StreamPlaceholder itemCount={5} />)
    const placeholderWrapper = screen.getByTestId(
      testIdLocators.placeholderWrapper
    )
    const placeholderItemList = screen.getAllByTestId(
      testIdLocators.placeholderItem
    )
    expect(placeholderWrapper).not.toBeNull()
    expect(placeholderItemList).toHaveLength(5)
  })
})
