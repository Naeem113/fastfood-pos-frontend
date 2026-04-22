export default interface MenuItem {
  title: string;
  subTitle?: string;
  icon: string;
  link: string;
  badge: Badge;
  active: boolean;
  children?: MenuItem[]; // Optional children array for nested item
  access: string[];
}

export interface Badge {
  value: number;
  color: string; // The color could be a string, like 'accent' or other color names
}
