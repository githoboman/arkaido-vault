import ArkadikoBeginnerWizard from "@/components/ArkadikoBeginnerWizard";
import StacksProvider from "@/components/StacksProvider";

export default function Home() {
    return (
        <StacksProvider>
            <main>
                <ArkadikoBeginnerWizard />
            </main>
        </StacksProvider>
    );
}
