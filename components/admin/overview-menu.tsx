"use client";

import { Dropdown } from "@/components/core_component";

export function OverviewMenu() {
  return (
    <Dropdown
      id="settings"
      placement="top-right"
      label={<span>Open</span>}
      items={[
        { children: <span>Item one</span>, onClick: () => {} },
        { children: <span>Item two</span>, onClick: () => {} },
      ]}
    />
  );
}
