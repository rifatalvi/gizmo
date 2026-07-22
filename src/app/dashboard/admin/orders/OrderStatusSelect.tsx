"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api";
import type { Selection } from "@heroui/react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from "@heroui/react";

// Light mode: black text + coloured background
// Dark mode: coloured text + dimmed background
const STATUS_STYLES: Record<string, string> = {
    pending:
        "text-gray-900 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
    processing:
        "text-gray-900 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50",
    shipped:
        "text-gray-900 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50",
    delivered:
        "text-gray-900 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
    cancelled:
        "text-gray-900 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50",
};

// Capitalised labels for display
const STATUS_LABELS: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
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

    useEffect(() => {
        setSelected(new Set([initialStatus]));
    }, [initialStatus]);

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
            <DropdownTrigger>
                <Button
                    aria-label="Order Status"
                    variant="ghost"
                    className={`
            px-3 py-1.5 text-xs font-semibold rounded-full capitalize 
            w-[110px] justify-between transition-all duration-200
            hover:scale-105 active:scale-95
            ${STATUS_STYLES[currentStatus] || ""}
            ${isLoading ? "opacity-60 pointer-events-none" : ""}
            `}
                    isDisabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-1">
                            <Spinner size="sm" color="current" />
                            <span>Updating…</span>
                        </span>
                    ) : (
                        STATUS_LABELS[currentStatus] || currentStatus
                    )}
                </Button>
            </DropdownTrigger>

            <DropdownMenu
                aria-label="Update Status"
                selectedKeys={selected}
                selectionMode="single"
                onSelectionChange={handleSelectionChange}
                className="min-w-[200px]"
            >
                {Object.entries(STATUS_LABELS).map(([id, label]) => {
                    const isSelected = selected === "all" || selected.has(id);
                    const colorClasses = STATUS_STYLES[id] || "";
                    // Extract background and text classes for the dot
                    const bgClass = colorClasses
                        .split(" ")
                        .find((c) => c.startsWith("bg-") || c.startsWith("dark:bg-"));

                    return (
                        <DropdownItem
                            key={id}
                            textValue={label}
                            className={`
                        flex items-center gap-2 px-3 py-2 text-sm text-slate-900 dark:text-slate-100
                        hover:bg-default-100 dark:hover:bg-default-50
                        data-[highlighted]:bg-default-100 dark:data-[highlighted]:bg-default-50
                        transition-colors duration-150
                        ${isSelected ? "bg-default-200/50 dark:bg-default-100/30" : ""}
                    `}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        {isSelected ? CustomCheckmarkIcon : null}
                                    </span>
                                    <span>{label}</span>
                                </div>
                                {/* Status colour indicator dot */}
                                <span
                                    className={`
                                w-2.5 h-2.5 rounded-full flex-shrink-0
                                ${bgClass || "bg-gray-300 dark:bg-gray-600"}
                                `}
                                />
                            </div>
                        </DropdownItem>
                    );
                })}
            </DropdownMenu>
        </Dropdown>
    );
}