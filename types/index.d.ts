interface PaginatedResults {
  results: any[];
  current_page: 1;
  previous_page: number | null;
  next_page: number | null;
  count: number;
  total_pages: number;
}

interface Customer {
  id: number;
  name: string;
  contact: string;
}

interface Business {
  id: number;
  name: string;
  contact: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

interface Quotation {
  id: number;
  title: string;
}

interface PaginatedProducts extends PaginatedResults {
  results: Product[];
}
