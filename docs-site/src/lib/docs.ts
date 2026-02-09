import docsData from '../../docs.json';

export interface DocNode {
  id: number;
  name: string;
  kind: number;
  kindString?: string;
  flags?: {
    isOptional?: boolean;
    isPrivate?: boolean;
    isProtected?: boolean;
    isStatic?: boolean;
    isExternal?: boolean;
  };
  defaultValue?: string;
  children?: DocNode[];
  groups?: {
    title: string;
    children: number[];
  }[];
  sources?: {
    fileName: string;
    line: number;
    character: number;
  }[];
  comment?: {
    summary?: {
      kind: string;
      text: string;
    }[];
  };
  signatures?: DocNode[];
  parameters?: DocNode[];
  type?: any;
  extendedTypes?: any[];
  implementedTypes?: any[];
}

// TypeDoc Kinds (partial list relevant for us)
export const Kind = {
  Project: 1,
  Module: 2,
  Namespace: 4,
  Enum: 8,
  EnumMember: 16,
  Variable: 32,
  Function: 64,
  Class: 128,
  Interface: 256,
  Constructor: 512,
  Property: 1024,
  Method: 2048,
  CallSignature: 4096,
  IndexSignature: 8192,
  ConstructorSignature: 16384,
  Parameter: 32768,
  TypeLiteral: 65536,
  TypeParameter: 131072,
  Accessor: 262144,
  GetSignature: 524288,
  SetSignature: 1048576,
  ObjectLiteral: 2097152,
  TypeAlias: 4194304,
  Event: 8388608,
};

export function getDocs(): DocNode {
  return docsData as unknown as DocNode;
}

export function findNode(slug: string[]): DocNode | null {
  const root = getDocs();
  if (!slug || slug.length === 0) return root;

  const categories = ['classes', 'interfaces', 'enums', 'functions', 'types'];
  let searchSlug = slug;

  // If the first part is a category (e.g. 'classes'), skip it or return root if it's the only part
  if (categories.includes(slug[0])) {
    if (slug.length === 1) {
      // User is at /docs/classes, /docs/interfaces etc.
      // Returning root allows the dashboard to render, or we could implement filtering in page.tsx
      return root;
    }
    searchSlug = slug.slice(1);
  }

  let current: DocNode | undefined = root;

  for (const part of searchSlug) {
    if (!current?.children) return null;
    current = current.children.find(child => child.name === part);
    if (!current) return null;
  }

  return current || null;
}

export interface SidebarItem {
  title: string;
  path: string;
  children?: SidebarItem[];
  kind?: number;
}

export interface SearchItem {
  title: string;
  path: string;
  kind: number;
  kindString?: string;
}

export function getAllSearchItems(): SearchItem[] {
  const root = getDocs();
  const items: SearchItem[] = [];

  if (!root.children) return items;

  function traverse(node: DocNode, parentPath: string = '/docs') {
    if (node.kind === Kind.Class) {
        items.push({ title: node.name, path: `${parentPath}/classes/${node.name}`, kind: node.kind, kindString: 'Class' });
        node.children?.forEach(child => {
            if (child.kind === Kind.Method || child.kind === Kind.Property) {
                 items.push({ 
                    title: `${node.name}.${child.name}`, 
                    path: `${parentPath}/classes/${node.name}#${child.name}`, 
                    kind: child.kind, 
                    kindString: child.kind === Kind.Method ? 'Method' : 'Property' 
                });
            }
        });
    } else if (node.kind === Kind.Interface) {
        items.push({ title: node.name, path: `${parentPath}/interfaces/${node.name}`, kind: node.kind, kindString: 'Interface' });
    } else if (node.kind === Kind.Function) {
        items.push({ title: node.name, path: `${parentPath}/functions/${node.name}`, kind: node.kind, kindString: 'Function' });
    } else if (node.kind === Kind.TypeAlias) {
        items.push({ title: node.name, path: `${parentPath}/types/${node.name}`, kind: node.kind, kindString: 'Type' });
    }
    
    // Recursive traversal if needed for namespaces, but for now flat structure at top level is mostly what we have
  }

  root.children.forEach(child => traverse(child));
  return items;
}

export function getSidebarData(): SidebarItem[] {
  const root = getDocs();
  const items: SidebarItem[] = [];

  if (!root.children) return items;

  // Manual Pages
  items.push({
    title: 'General',
    path: '/docs', // Just a header, or link to docs root
    children: [
        { title: 'Getting Started', path: '/docs/guide/getting-started', kind: 0 },
        { title: 'Changelog', path: '/docs/changelog', kind: 0 }
    ]
  });

  // Group by kind for sidebar
  const classes = root.children.filter(child => child.kind === Kind.Class);
  const interfaces = root.children.filter(child => child.kind === Kind.Interface);
  const functions = root.children.filter(child => child.kind === Kind.Function);
  const typeAliases = root.children.filter(child => child.kind === Kind.TypeAlias);
  const enums = root.children.filter(child => child.kind === Kind.Enum);

  if (classes.length > 0) {
    items.push({
      title: 'Classes',
      path: '/docs/classes',
      children: classes.map(c => ({ title: c.name, path: `/docs/classes/${c.name}`, kind: c.kind }))
    });
  }

  if (interfaces.length > 0) {
    items.push({
      title: 'Interfaces',
      path: '/docs/interfaces',
      children: interfaces.map(c => ({ title: c.name, path: `/docs/interfaces/${c.name}`, kind: c.kind }))
    });
  }
  
    if (enums.length > 0) {
    items.push({
      title: 'Enums',
      path: '/docs/enums',
      children: enums.map(c => ({ title: c.name, path: `/docs/enums/${c.name}`, kind: c.kind }))
    });
  }

  if (functions.length > 0) {
     items.push({
      title: 'Functions',
      path: '/docs/functions',
      children: functions.map(c => ({ title: c.name, path: `/docs/functions/${c.name}`, kind: c.kind }))
    });
  }

  if (typeAliases.length > 0) {
      items.push({
      title: 'Types',
      path: '/docs/types',
      children: typeAliases.map(c => ({ title: c.name, path: `/docs/types/${c.name}`, kind: c.kind }))
    });
  }

  return items;
}
