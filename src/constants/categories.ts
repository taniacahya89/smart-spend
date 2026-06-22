import { ExpenseCategory } from "@/types";

export interface CategoryInfo {
  name: ExpenseCategory;
  color: string; // hex
  bgClass: string; // tailwind bg color (soft/muted)
  textClass: string; // tailwind text color
  borderClass: string; // tailwind border color
  icon: string; // lucide icon name representation
}

export const CATEGORIES: ExpenseCategory[] = [
  "Makanan & Minuman",
  "Transport",
  "Belanja",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Tagihan",
  "Lainnya"
];

export const CATEGORY_MAP: Record<ExpenseCategory, CategoryInfo> = {
  "Makanan & Minuman": {
    name: "Makanan & Minuman",
    color: "#F97316",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-400",
    borderClass: "border-orange-500/20",
    icon: "Utensils"
  },
  "Transport": {
    name: "Transport",
    color: "#38BDF8",
    bgClass: "bg-sky-500/10",
    textClass: "text-sky-400",
    borderClass: "border-sky-500/20",
    icon: "Car"
  },
  "Belanja": {
    name: "Belanja",
    color: "#A78BFA",
    bgClass: "bg-violet-500/10",
    textClass: "text-violet-400",
    borderClass: "border-violet-500/20",
    icon: "ShoppingBag"
  },
  "Hiburan": {
    name: "Hiburan",
    color: "#FB7185",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-400",
    borderClass: "border-rose-500/20",
    icon: "Tv"
  },
  "Kesehatan": {
    name: "Kesehatan",
    color: "#34D399",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/20",
    icon: "Heart"
  },
  "Pendidikan": {
    name: "Pendidikan",
    color: "#60A5FA",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/20",
    icon: "GraduationCap"
  },
  "Tagihan": {
    name: "Tagihan",
    color: "#FBBF24",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/20",
    icon: "CreditCard"
  },
  "Lainnya": {
    name: "Lainnya",
    color: "#94A3B8",
    bgClass: "bg-slate-500/10",
    textClass: "text-slate-400",
    borderClass: "border-slate-500/20",
    icon: "HelpCircle"
  }
};
