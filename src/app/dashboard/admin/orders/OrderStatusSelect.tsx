"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api";
import type { Selection } from "@heroui/react";
import { Button, Dropdown, Header, Label } from "@heroui/react";

const STATUS_STYLES: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    shipped: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
};

interface Props {
    orderId: string;
    initialStatus: string;
}

const CustomCheckmarkIcon = (
    <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
        <path
            className="text-accent-soft-foreground"
            clipRule="evenodd"
            d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m3.1-8.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
);

export function OrderStatusSelect({ orderId, initialStatus }: Props) {
    const router = useRouter();
    const [selected, setSelected] = useState<Selection>(new Set([initialStatus]));
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectionChange = async (keys: Selection) => {
        setSelected(keys);

        const selectedValue = Array.from(keys).join("") as string;
        if (!selectedValue) return;

        setIsLoading(true);
        try {
            await ordersApi.updateStatus(orderId, selectedValue);
            router.refresh();
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on error
            setSelected(new Set([initialStatus]));
        } finally {
            setIsLoading(false);
        }
    };

    const currentStatus = Array.from(selected).join("") as string;

    return (
        <Dropdown>
            <Button
                aria-label="Order Status"
                variant="flat"
                className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize w-[110px] justify-between ${STATUS_STYLES[currentStatus] || ""}`}
                isLoading={isLoading}
            >
                {currentStatus}
            </Button>
            <Dropdown.Popover className="min-w-[200px]">
                <Dropdown.Menu
                    selectedKeys={selected}
                    selectionMode="single"
                    onSelectionChange={handleSelectionChange}
                >
                    <Dropdown.Section>
                        <Header>Update Status</Header>
                        <Dropdown.Item id="pending" textValue="Pending">
                            <Dropdown.ItemIndicator>
                                {({ isSelected }) => (isSelected ? CustomCheckmarkIcon : null)}
                            </Dropdown.ItemIndicator>
                            <Label>Pending</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="processing" textValue="Processing">
                            <Dropdown.ItemIndicator>
                                {({ isSelected }) => (isSelected ? CustomCheckmarkIcon : null)}
                            </Dropdown.ItemIndicator>
                            <Label>Processing</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="shipped" textValue="Shipped">
                            <Dropdown.ItemIndicator>
                                {({ isSelected }) => (isSelected ? CustomCheckmarkIcon : null)}
                            </Dropdown.ItemIndicator>
                            <Label>Shipped</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="delivered" textValue="Delivered">
                            <Dropdown.ItemIndicator>
                                {({ isSelected }) => (isSelected ? CustomCheckmarkIcon : null)}
                            </Dropdown.ItemIndicator>
                            <Label>Delivered</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="cancelled" textValue="Cancelled">
                            <Dropdown.ItemIndicator>
                                {({ isSelected }) => (isSelected ? CustomCheckmarkIcon : null)}
                            </Dropdown.ItemIndicator>
                            <Label>Cancelled</Label>
                        </Dropdown.Item>
                    </Dropdown.Section>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
