# Arkadiko Beginner Wizard Vault

## Overview
A beginner-friendly interface for the Arkadiko Protocol on the Stacks blockchain. This application guides users through the process of connecting their wallet, depositing STX, and minting USDA (borrowing) to create their first vault.

## Key Features
- **Wallet Connection**: Integrated with standard Stacks wallets (Leather, Xverse) using `@stacks/connect`.
- **Beginner Wizard**: Step-by-step guidance for vault creation.
    - **Step 1**: Deposit STX collateral.
    - **Step 2**: Select USDA borrow amount (safe/verified limits).
    - **Step 3**: Confirmation and transaction signing.
- **Dashboard**: Simple view to manage your vault and view balances after creation.
- **Real-time Pricing**: Fetches current STX price to calculate collateralization ratios.

## Technology Stack
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Blockchain Interaction**: 
    - `@stacks/connect` (v8+): Wallet authentication and transaction requests.
    - `@stacks/network`: Network configuration (Mainnet/Testnet).
- **Styling**: `lucide-react` for icons, custom CSS modules.
- **State Management**: React Context (`StacksProvider`) + Local Storage for session persistence.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Stacks Wallet extension (Leather or Xverse) installed in your browser.

### Installation
1.  Clone the repository:
    ```bash
    git clone <repo-url>
    cd <repo-directory>
    ```
2.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```

### Running the App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## Component Structure
- `components/StacksProvider.tsx`: Centralized context for wallet authentication and user session management. Handles manual session persistence.
- `components/ArkadikoBeginnerWizard.tsx`: The core wizard component. Handles the 3-step vault creation flow.
- `components/Dashboard.tsx`: Displays user stats and vault info after successful interaction.
- `app/page.tsx`: Main entry point, wrapping the wizard with the `StacksProvider`.

## Recent Updates
- Migrated from `@stacks/connect-react` to `@stacks/connect` v8.
- Implemented robust `localStorage` session handling for improved wallet connectivity.
