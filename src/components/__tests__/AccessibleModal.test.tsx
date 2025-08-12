import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessibleModal from '../AccessibleModal';

describe('AccessibleModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open', () => {
    render(
      <AccessibleModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        description="Test description"
      >
        <div>Modal content</div>
      </AccessibleModal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <AccessibleModal
        isOpen={false}
        onClose={mockOnClose}
        title="Test Modal"
        description="Test description"
      >
        <div>Modal content</div>
      </AccessibleModal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <AccessibleModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        description="Test description"
      >
        <div>Modal content</div>
      </AccessibleModal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper ARIA attributes', () => {
    render(
      <AccessibleModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        description="Test description"
      >
        <div>Modal content</div>
      </AccessibleModal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('has proper focus management', () => {
    render(
      <AccessibleModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        description="Test description"
      >
        <div>Modal content</div>
      </AccessibleModal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('tabindex', '-1');
  });
}); 