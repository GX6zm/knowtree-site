// OI 科技树数据
export interface OINode {
  id: string;
  name: string;
  category: string;
  importance: number; // 1-5
  description: string;
  prerequisites: string[];
  level: number; // 0-4, 入门到国赛
  x?: number;
  y?: number;
  z?: number;
}

export interface OICategory {
  name: string;
  color: string;
  items: string[];
}

export const categories: OICategory[] = [
  {
    name: "基础算法",
    color: "#39cbd0",
    items: ["模拟", "枚举", "贪心", "分治", "二分答案", "排序", "搜索", "递归", "倍增", "尺取法"]
  },
  {
    name: "数据结构",
    color: "#62c9da",
    items: ["栈", "队列", "链表", "堆", "并查集", "树状数组", "线段树", "平衡树", "分块", "单调栈", "单调队列", "可持久化数据结构", "LCT", "树分块", "KD-Tree", "替罪羊树"]
  },
  {
    name: "图论",
    color: "#a8cc3e",
    items: ["DFS", "BFS", "最短路", "最小生成树", "拓扑排序", "强连通分量", "割点割边", "2-SAT", "网络流", "二分图匹配", "欧拉回路", "差分约束", "树上问题", "支配树", "虚树", "圆方树"]
  },
  {
    name: "动态规划",
    color: "#d09439",
    items: ["背包DP", "区间DP", "树形DP", "状压DP", "数位DP", "概率DP", "期望DP", "插头DP", "斜率优化", "四边形不等式", "DP优化", "树形依赖背包", "轮廓线DP", "记忆化搜索"]
  },
  {
    name: "数学",
    color: "#c93ecc",
    items: ["数论基础", "GCD/LCM", "快速幂", "素数筛", "欧拉函数", "中国剩余定理", "扩展欧几里得", "矩阵快速幂", "高斯消元", "组合数学", "容斥原理", "Burnside引理", "生成函数", "多项式", "FFT/NTT", "线性代数"]
  },
  {
    name: "字符串",
    color: "#d03945",
    items: ["KMP", "Trie", "AC自动机", "后缀数组", "后缀自动机", "回文自动机", "Manacher", "字符串哈希", "最小表示法", "字典序"]
  },
  {
    name: "计算几何",
    color: "#ccaa3e",
    items: ["凸包", "线段相交", "半平面交", "旋转卡壳", "三角剖分", "Voronoi图", "Delaunay三角化", "计算几何基础", "叉积", "极角排序"]
  },
  {
    name: "高级技巧",
    color: "#cc3e90",
    items: ["莫队算法", "CDQ分治", "整体二分", "树分治", "启发式合并", "长链剖分", "dsu on tree", "带花树", "斯坦纳树", "最小树形图", "费用流", "上下界网络流"]
  }
];

export const nodes: OINode[] = [
  // 基础算法
  { id: "simulate", name: "模拟", category: "基础算法", importance: 4, description: "按照题意直接模拟过程", prerequisites: [], level: 0 },
  { id: "enumerate", name: "枚举", category: "基础算法", importance: 4, description: "穷举所有可能的方案", prerequisites: [], level: 0 },
  { id: "greedy", name: "贪心", category: "基础算法", importance: 5, description: "每步选择局部最优解", prerequisites: ["simulate", "enumerate"], level: 0 },
  { id: "divide", name: "分治", category: "基础算法", importance: 5, description: "将问题分解为子问题分别求解", prerequisites: ["enumerate"], level: 1 },
  { id: "binary_search", name: "二分答案", category: "基础算法", importance: 5, description: "二分搜索满足条件的答案", prerequisites: ["enumerate"], level: 0 },
  { id: "sort", name: "排序", category: "基础算法", importance: 5, description: "各种排序算法：冒泡、快排、归并等", prerequisites: ["simulate"], level: 0 },
  { id: "search", name: "搜索(DFS/BFS)", category: "基础算法", importance: 5, description: "深度优先搜索与广度优先搜索", prerequisites: ["simulate", "enumerate"], level: 0 },
  { id: "recursion", name: "递归", category: "基础算法", importance: 4, description: "函数调用自身解决问题", prerequisites: [], level: 0 },
  { id: "binary_lift", name: "倍增", category: "基础算法", importance: 4, description: "利用倍增思想加速", prerequisites: ["divide", "binary_search"], level: 1 },
  { id: "two_pointer", name: "尺取法/双指针", category: "基础算法", importance: 4, description: "利用单调性用两个指针扫描", prerequisites: ["greedy"], level: 1 },

  // 数据结构
  { id: "stack", name: "栈", category: "数据结构", importance: 4, description: "后进先出的线性数据结构", prerequisites: ["simulate"], level: 0 },
  { id: "queue", name: "队列", category: "数据结构", importance: 4, description: "先进先出的线性数据结构", prerequisites: ["simulate"], level: 0 },
  { id: "linked_list", name: "链表", category: "数据结构", importance: 3, description: "链式存储的线性结构", prerequisites: ["simulate"], level: 0 },
  { id: "heap", name: "堆/优先队列", category: "数据结构", importance: 5, description: "支持快速取最值的数据结构", prerequisites: ["queue", "sort"], level: 1 },
  { id: "dsu", name: "并查集", category: "数据结构", importance: 5, description: "维护集合的合并与查询", prerequisites: ["search"], level: 1 },
  { id: "bit", name: "树状数组(BIT)", category: "数据结构", importance: 5, description: "支持单点修改和前缀查询", prerequisites: ["sort", "binary_search"], level: 1 },
  { id: "segtree", name: "线段树", category: "数据结构", importance: 5, description: "区间查询与修改的核心数据结构", prerequisites: ["divide", "bit"], level: 2 },
  { id: "balanced_tree", name: "平衡树(Splay/Treap)", category: "数据结构", importance: 4, description: "维护有序序列的平衡二叉搜索树", prerequisites: ["heap", "segtree"], level: 2 },
  { id: "sqrt_decomp", name: "分块", category: "数据结构", importance: 4, description: "将序列分块处理", prerequisites: ["bit"], level: 1 },
  { id: "mono_stack", name: "单调栈", category: "数据结构", importance: 4, description: "维护单调性的栈结构", prerequisites: ["stack", "greedy"], level: 1 },
  { id: "mono_queue", name: "单调队列", category: "数据结构", importance: 4, description: "滑动窗口最值优化", prerequisites: ["queue", "greedy"], level: 1 },
  { id: "persistent", name: "可持久化数据结构", category: "数据结构", importance: 4, description: "保留历史版本的数据结构", prerequisites: ["segtree", "balanced_tree"], level: 3 },
  { id: "lct", name: "LCT(动态树)", category: "数据结构", importance: 3, description: "Link-Cut Tree 维护动态森林", prerequisites: ["balanced_tree", "dsu"], level: 3 },
  { id: "tree_block", name: "树分块", category: "数据结构", importance: 3, description: "将树分块处理问题", prerequisites: ["sqrt_decomp", "search"], level: 2 },
  { id: "kdtree", name: "KD-Tree", category: "数据结构", importance: 3, description: "多维空间查询的数据结构", prerequisites: ["segtree", "divide"], level: 3 },
  { id: "scapegoat", name: "替罪羊树", category: "数据结构", importance: 2, description: "通过重构维持平衡的BST", prerequisites: ["balanced_tree"], level: 3 },

  // 图论
  { id: "dfs", name: "DFS", category: "图论", importance: 5, description: "深度优先遍历图", prerequisites: ["search"], level: 0 },
  { id: "bfs", name: "BFS", category: "图论", importance: 5, description: "广度优先遍历图", prerequisites: ["search"], level: 0 },
  { id: "shortest_path", name: "最短路(Dijkstra/SPFA/Floyd)", category: "图论", importance: 5, description: "求图中两点间最短路径", prerequisites: ["bfs", "greedy"], level: 1 },
  { id: "mst", name: "最小生成树(Kruskal/Prim)", category: "图论", importance: 5, description: "连接所有点的最小代价树", prerequisites: ["dsu", "greedy"], level: 1 },
  { id: "topo_sort", name: "拓扑排序", category: "图论", importance: 4, description: "DAG上的线性排序", prerequisites: ["dfs", "bfs"], level: 1 },
  { id: "scc", name: "强连通分量(Tarjan)", category: "图论", importance: 4, description: "求有向图的强连通分量", prerequisites: ["dfs", "topo_sort"], level: 2 },
  { id: "bridge", name: "割点割边", category: "图论", importance: 3, description: "求图的割点和桥", prerequisites: ["dfs", "scc"], level: 2 },
  { id: "two_sat", name: "2-SAT", category: "图论", importance: 3, description: "2-可满足性问题", prerequisites: ["scc"], level: 2 },
  { id: "network_flow", name: "网络流(最大流)", category: "图论", importance: 5, description: "Dinic/ISAP等最大流算法", prerequisites: ["bfs", "shortest_path"], level: 2 },
  { id: "bipartite", name: "二分图匹配", category: "图论", importance: 4, description: "匈牙利算法/Hopcroft-Karp", prerequisites: ["bfs", "dfs"], level: 2 },
  { id: "euler", name: "欧拉路径/回路", category: "图论", importance: 3, description: "遍历所有边恰好一次", prerequisites: ["dfs"], level: 1 },
  { id: "diff_constraint", name: "差分约束", category: "图论", importance: 3, description: "将不等式组转化为最短路问题", prerequisites: ["shortest_path"], level: 2 },
  { id: "tree_problems", name: "树上问题(DFS序/LCA)", category: "图论", importance: 5, description: "树的遍历、LCA、直径等", prerequisites: ["dfs", "binary_lift"], level: 1 },
  { id: "dominator", name: "支配树", category: "图论", importance: 2, description: "求DAG上每个点的支配关系", prerequisites: ["scc", "topo_sort"], level: 3 },
  { id: "virtual_tree", name: "虚树", category: "图论", importance: 3, description: "提取关键点构成的树", prerequisites: ["tree_problems", "divide"], level: 3 },
  { id: "block_cut_tree", name: "圆方树", category: "图论", importance: 3, description: "将点双/边双转化为树结构", prerequisites: ["scc", "bridge"], level: 3 },

  // 动态规划
  { id: "knapsack_dp", name: "背包DP", category: "动态规划", importance: 5, description: "01背包/完全背包/多重背包", prerequisites: ["greedy", "recursion"], level: 1 },
  { id: "interval_dp", name: "区间DP", category: "动态规划", importance: 4, description: "在区间上进行状态转移", prerequisites: ["recursion", "divide"], level: 1 },
  { id: "tree_dp", name: "树形DP", category: "动态规划", importance: 5, description: "在树结构上进行动态规划", prerequisites: ["dfs", "recursion"], level: 2 },
  { id: "bitmask_dp", name: "状压DP", category: "动态规划", importance: 4, description: "用二进制表示状态进行DP", prerequisites: ["recursion", "enumerate"], level: 2 },
  { id: "digit_dp", name: "数位DP", category: "动态规划", importance: 4, description: "按数位进行状态转移", prerequisites: ["recursion", "binary_search"], level: 2 },
  { id: "prob_dp", name: "概率/期望DP", category: "动态规划", importance: 4, description: "求概率或期望值的DP", prerequisites: ["knapsack_dp"], level: 2 },
  { id: "plug_dp", name: "插头DP", category: "动态规划", importance: 2, description: "轮廓线DP处理棋盘覆盖", prerequisites: ["bitmask_dp", "interval_dp"], level: 3 },
  { id: "slope_opt", name: "斜率优化", category: "动态规划", importance: 4, description: "利用凸性优化DP转移", prerequisites: ["mono_queue", "interval_dp"], level: 2 },
  { id: "quad_ineq", name: "四边形不等式", category: "动态规划", importance: 2, description: "优化区间DP的决策单调性", prerequisites: ["interval_dp"], level: 3 },
  { id: "dp_opt", name: "DP优化(决策单调性/WQS二分)", category: "动态规划", importance: 4, description: "各种DP优化技巧", prerequisites: ["slope_opt", "binary_search"], level: 3 },
  { id: "tree_knapsack", name: "树形依赖背包", category: "动态规划", importance: 3, description: "树上背包问题", prerequisites: ["tree_dp", "knapsack_dp"], level: 2 },
  { id: "contour_dp", name: "轮廓线DP", category: "动态规划", importance: 3, description: "逐格推进的DP方式", prerequisites: ["bitmask_dp"], level: 3 },
  { id: "memo_search", name: "记忆化搜索", category: "动态规划", importance: 4, description: "用缓存优化搜索", prerequisites: ["search", "recursion"], level: 1 },

  // 数学
  { id: "num_theory", name: "数论基础", category: "数学", importance: 5, description: "整除、同余等基本概念", prerequisites: [], level: 0 },
  { id: "gcd_lcm", name: "GCD/LCM", category: "数学", importance: 5, description: "辗转相除法求最大公约数", prerequisites: ["num_theory"], level: 0 },
  { id: "fast_pow", name: "快速幂", category: "数学", importance: 5, description: "O(log n)计算幂次", prerequisites: ["binary_lift", "num_theory"], level: 1 },
  { id: "prime_sieve", name: "素数筛(埃氏筛/欧拉筛)", category: "数学", importance: 5, description: "高效求素数", prerequisites: ["num_theory"], level: 1 },
  { id: "euler_func", name: "欧拉函数/欧拉定理", category: "数学", importance: 4, description: "φ(n)与欧拉定理", prerequisites: ["prime_sieve", "gcd_lcm"], level: 1 },
  { id: "crt", name: "中国剩余定理(CRT)", category: "数学", importance: 4, description: "求解一元线性同余方程组", prerequisites: ["gcd_lcm", "euler_func"], level: 2 },
  { id: "exgcd", name: "扩展欧几里得(exgcd)", category: "数学", importance: 5, description: "求ax+by=gcd(a,b)的解", prerequisites: ["gcd_lcm"], level: 1 },
  { id: "matrix_pow", name: "矩阵快速幂", category: "数学", importance: 4, description: "矩阵的快速幂运算", prerequisites: ["fast_pow"], level: 2 },
  { id: "gauss", name: "高斯消元", category: "数学", importance: 4, description: "求解线性方程组", prerequisites: ["matrix_pow"], level: 2 },
  { id: "combinatorics", name: "组合数学", category: "数学", importance: 5, description: "排列组合、卡特兰数等", prerequisites: ["num_theory", "fast_pow"], level: 1 },
  { id: "inclusion_exclusion", name: "容斥原理", category: "数学", importance: 4, description: "计数中的容斥方法", prerequisites: ["combinatorics"], level: 2 },
  { id: "burnside", name: "Burnside引理/Pólya计数", category: "数学", importance: 3, description: "处理等价类计数", prerequisites: ["combinatorics", "inclusion_exclusion"], level: 3 },
  { id: "gen_func", name: "生成函数", category: "数学", importance: 3, description: "用形式幂级数处理计数", prerequisites: ["combinatorics"], level: 3 },
  { id: "polynomial", name: "多项式(FFT/NTT)", category: "数学", importance: 4, description: "快速多项式乘法", prerequisites: ["fast_pow", "num_theory"], level: 3 },
  { id: "linear_algebra", name: "线性代数(行列式/矩阵树)", category: "数学", importance: 3, description: "矩阵相关的高级应用", prerequisites: ["gauss", "matrix_pow"], level: 3 },

  // 字符串
  { id: "kmp", name: "KMP", category: "字符串", importance: 5, description: "线性字符串匹配算法", prerequisites: ["binary_search"], level: 1 },
  { id: "trie", name: "Trie(字典树)", category: "字符串", importance: 5, description: "前缀树结构", prerequisites: ["search"], level: 1 },
  { id: "ac_automaton", name: "AC自动机", category: "字符串", importance: 4, description: "多模式串匹配", prerequisites: ["kmp", "trie"], level: 2 },
  { id: "suffix_array", name: "后缀数组(SA)", category: "字符串", importance: 4, description: "后缀排序与LCP", prerequisites: ["sort", "binary_search"], level: 2 },
  { id: "suffix_automaton", name: "后缀自动机(SAM)", category: "字符串", importance: 4, description: "DAG表示所有子串", prerequisites: ["suffix_array", "trie"], level: 3 },
  { id: "pam", name: "回文自动机(PAM)", category: "字符串", importance: 3, description: "处理回文串问题", prerequisites: ["trie", "kmp"], level: 3 },
  { id: "manacher", name: "Manacher", category: "字符串", importance: 4, description: "线性求最长回文子串", prerequisites: ["kmp"], level: 2 },
  { id: "hash", name: "字符串哈希", category: "字符串", importance: 5, description: "将字符串映射为整数", prerequisites: ["fast_pow"], level: 1 },
  { id: "min_repr", name: "最小表示法", category: "字符串", importance: 3, description: "求循环串的最小表示", prerequisites: ["two_pointer"], level: 2 },
  { id: "lex_order", name: "字典序", category: "字符串", importance: 3, description: "字符串比较与排序", prerequisites: ["sort"], level: 1 },

  // 计算几何
  { id: "convex_hull", name: "凸包", category: "计算几何", importance: 5, description: "Andrew/Graham求凸包", prerequisites: ["sort", "greedy"], level: 1 },
  { id: "seg_intersect", name: "线段相交判断", category: "计算几何", importance: 4, description: "判断两线段是否相交", prerequisites: ["greedy"], level: 1 },
  { id: "half_plane", name: "半平面交", category: "计算几何", importance: 3, description: "求多个半平面的交集", prerequisites: ["convex_hull"], level: 2 },
  { id: "rotating_calipers", name: "旋转卡壳", category: "计算几何", importance: 3, description: "在凸包上旋转对踵点对", prerequisites: ["convex_hull", "two_pointer"], level: 2 },
  { id: "triangulation", name: "三角剖分", category: "计算几何", importance: 2, description: "将多边形分解为三角形", prerequisites: ["convex_hull"], level: 2 },
  { id: "voronoi", name: "Voronoi图", category: "计算几何", importance: 2, description: "最近邻区域划分", prerequisites: ["convex_hull", "half_plane"], level: 3 },
  { id: "delaunay", name: "Delaunay三角化", category: "计算几何", importance: 2, description: "Voronoi图的对偶图", prerequisites: ["voronoi"], level: 3 },
  { id: "geo_basic", name: "计算几何基础(点/向量)", category: "计算几何", importance: 5, description: "点、向量、距离等基本运算", prerequisites: ["greedy"], level: 0 },
  { id: "cross_product", name: "叉积/点积", category: "计算几何", importance: 5, description: "向量运算基础", prerequisites: ["geo_basic"], level: 1 },
  { id: "polar_sort", name: "极角排序", category: "计算几何", importance: 4, description: "按极角排序点/向量", prerequisites: ["cross_product", "sort"], level: 1 },

  // 高级技巧
  { id: "mo_algo", name: "莫队算法", category: "高级技巧", importance: 4, description: "离线处理区间查询", prerequisites: ["sqrt_decomp", "sort"], level: 2 },
  { id: "cdq", name: "CDQ分治", category: "高级技巧", importance: 4, description: "分治处理偏序问题", prerequisites: ["divide", "sort"], level: 2 },
  { id: "overall_binary", name: "整体二分", category: "高级技巧", importance: 4, description: "对所有询问同时二分", prerequisites: ["binary_search", "divide"], level: 2 },
  { id: "tree_divide", name: "树分治(点分治/边分治)", category: "高级技巧", importance: 4, description: "在树上进行分治", prerequisites: ["divide", "tree_problems"], level: 2 },
  { id: "heuristic_merge", name: "启发式合并", category: "高级技巧", importance: 3, description: "小的合并到大的上", prerequisites: ["balanced_tree", "tree_dp"], level: 3 },
  { id: "long_chain", name: "长链剖分", category: "高级技巧", importance: 3, description: "按最长链剖分树", prerequisites: ["tree_problems", "heavy_light"], level: 3 },
  { id: "dsu_on_tree", name: "dsu on tree(树上莫队)", category: "高级技巧", importance: 3, description: "在树上做类似莫队的操作", prerequisites: ["mo_algo", "tree_problems"], level: 3 },
  { id: "blossom", name: "带花树(一般图匹配)", category: "高级技巧", importance: 2, description: "一般图最大匹配", prerequisites: ["bipartite"], level: 3 },
  { id: "steiner", name: "斯坦纳树", category: "高级技巧", importance: 3, description: "连接关键点的最小树", prerequisites: ["bitmask_dp", "shortest_path"], level: 3 },
  { id: "dmst", name: "最小树形图", category: "高级技巧", importance: 2, description: "有向图的最小生成树", prerequisites: ["mst"], level: 3 },
  { id: "mcmf", name: "费用流(MCMF)", category: "高级技巧", importance: 4, description: "最小费用最大流", prerequisites: ["network_flow"], level: 3 },
  { id: "bound_flow", name: "上下界网络流", category: "高级技巧", importance: 3, description: "有流量上下界的网络流", prerequisites: ["network_flow"], level: 3 },
  // 补充节点
  { id: "heavy_light", name: "树链剖分", category: "图论", importance: 4, description: "轻重链剖分树，支持树上路径查询", prerequisites: ["tree_problems", "segtree"], level: 2 },
  { id: "big_int", name: "高精度运算", category: "数学", importance: 3, description: "大数加减乘除", prerequisites: ["simulate"], level: 0 },
  { id: "random", name: "随机化算法", category: "高级技巧", importance: 3, description: "随机化/模拟退火/爬山", prerequisites: ["greedy", "search"], level: 2 },
  { id: "game_theory", name: "博弈论(SG函数)", category: "数学", importance: 3, description: "组合游戏理论", prerequisites: ["greedy", "recursion"], level: 2 },
  { id: "flow_lower", name: "有源汇上下界可行流", category: "高级技巧", importance: 2, description: "带流量上下界的可行流", prerequisites: ["network_flow"], level: 3 },
];

export const allNodes = nodes;