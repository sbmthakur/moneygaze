import {
  PaidOutlined,
  ReceiptLongOutlined,
  HomeOutlined,
  InfoOutlined,
  HelpOutlineOutlined,
} from "@mui/icons-material";

export const NavigationLinks = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <HomeOutlined />,
  },
  {
    title: "Spendings",
    to: "/spendings",
    icon: <ReceiptLongOutlined />,
  },
  {
    title: "Financial Reckon",
    to: "/financial-reckon",
    icon: <PaidOutlined />,
  },
  {
    title: "About",
    to: "/about",
    icon: <InfoOutlined />,
  },
  {
    title: "FAQs",
    to: "/faqs",
    icon: <HelpOutlineOutlined />,
  },
];
