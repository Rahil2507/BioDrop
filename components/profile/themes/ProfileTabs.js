import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import ProfileEvents from "../ProfileEvents";
import ProfileLinks from "../ProfileLinks";
import ProfileMilestones from "../ProfileMilestones";
import ProfileTestimonials from "../ProfileTestimonials";
import Tabs from "../../Tabs";
import ProfileRepos from "../ProfileRepos";
import { useRouter } from "next/router";

export default function ProfileTabs({ data, BASE_URL }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "links";
  const defaultTabs = [
    {
      name: "My Links",
      href: "links",
      current: currentTab === "links" ? true : false,
    },
    {
      name: "Milestones",
      href: "milestones",
      current: currentTab === "milestones" ? true : false,
    },
    {
      name: "Testimonials",
      href: "testimonials",
      current: currentTab === "testimonials" ? true : false,
    },
    {
      name: "Events",
      href: "events",
      current: currentTab === "events" ? true : false,
    },
    {
      name: "Repos",
      href: "repos",
      current: currentTab === "repos" ? true : false,
    },
  ];

  let displayTabs = defaultTabs.flatMap((tab) => {
    if (tab.name === "Milestones") {
      if (data.milestones && data.milestones.length) {
        return { ...tab, total: data.milestones.length };
      }
      return [];
    }
    if (tab.name === "Testimonials") {
      if (data.testimonials && data.testimonials.length) {
        return { ...tab, total: data.testimonials.length };
      }
      return [];
    }
    if (tab.name === "Events") {
      if (data.events && data.events.length) {
        return { ...tab, total: data.events.length };
      }
      return [];
    }
    if (tab.name === "Repos") {
      if (data.repos && data.repos.length) {
        return { ...tab, total: data.repos.length };
      }
      return [];
    }

    return { ...tab, total: data.links?.length };
  });
  const [tabs, setTabs] = useState(displayTabs);
  const changeTab = (e, value) => {
    e.preventDefault();
    setTabs(
      tabs.map((tab) => {
        if (tab.name === e.target?.value || tab.name === value) {
          router.push({ pathname, query: { tab: tab.href } }, undefined, {
            scroll: false,
          });
          return { ...tab, current: true };
        } else {
          return { ...tab, current: false };
        }
      }),
    );
  };

  return (
    <>
      <Tabs tabs={tabs} setTabs={changeTab} />

      {tabs.find((tab) => tab.name === "My Links")?.current && (
        <ProfileLinks
          links={data.links}
          username={data.username}
          BASE_URL={BASE_URL}
        />
      )}

      {tabs.find((tab) => tab.name === "Milestones")?.current && (
        <ProfileMilestones milestones={data.milestones} />
      )}

      {tabs.find((tab) => tab.name === "Testimonials")?.current && (
        <ProfileTestimonials
          testimonials={data.testimonials}
          BASE_URL={BASE_URL}
        />
      )}

      {tabs.find((tab) => tab.name === "Events")?.current && (
        <ProfileEvents events={data.events} />
      )}

      {tabs.find((tab) => tab.name === "Repos")?.current && (
        <ProfileRepos repos={data.repos} />
      )}
    </>
  );
}