import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Sidebar from "./Sidebar";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
    usePathname: () => mockUsePathname(),
}));

describe("Sidebar", () => {
    it("renders all navigation items", () => {
        mockUsePathname.mockReturnValue("/dashboard");

        render(
            <Sidebar
                collapsed={false}
                mobileOpen={false}
                onCloseMobile={vi.fn()}
            />
        );

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Analyze CV")).toBeInTheDocument();
        expect(screen.getByText("History")).toBeInTheDocument();
        expect(screen.getByText("Account")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("marks the current page as active", () => {
        mockUsePathname.mockReturnValue("/dashboard/history");

        render(
            <Sidebar
                collapsed={false}
                mobileOpen={false}
                onCloseMobile={vi.fn()}
            />
        );

        const historyLink = screen.getByRole("link", { name: /history/i });

        expect(historyLink).toHaveClass("bg-accent");
    });

    it("calls onCloseMobile when the mobile overlay is clicked", () => {
        mockUsePathname.mockReturnValue("/dashboard");

        const onCloseMobile = vi.fn();

        render(
            <Sidebar
                collapsed={false}
                mobileOpen={true}
                onCloseMobile={onCloseMobile}
            />
        );

        const closeButton = screen.getByRole("button", {
            name: "Close navigation",
        });

        fireEvent.click(closeButton);

        expect(onCloseMobile).toHaveBeenCalledTimes(1);
    });
});