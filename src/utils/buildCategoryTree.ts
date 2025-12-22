import type { CollectionEntry } from "astro:content";

export interface CategoryNode {
  name: string;
  path: string;
  children: Record<string, CategoryNode>;
  hasPosts: boolean; // 当前分类是否有文章
}

export function buildCategoryTree(posts: CollectionEntry<"blog">[]): Record<string, CategoryNode> {
  const root: Record<string, CategoryNode> = {};

  posts.forEach(post => {
    if (!post.data.category) return;

    const parts = post.data.category.split("/");
    let current = root;
    let path = "";

    parts.forEach((part, index) => {
      path += (path ? "/" : "") + part;

      if (!current[part]) {
        current[part] = {
          name: part,
          path,
          children: {},
          hasPosts: false,
        };
      }

      // 只有最终节点标记有文章
      if (index === parts.length - 1) current[part].hasPosts = true;

      current = current[part].children;
    });
  });

  return root;
}
