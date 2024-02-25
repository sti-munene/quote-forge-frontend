import axios from "axios";
import { Session } from "next-auth";

const baseAPIUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getBusiness = async (session: Session) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/business/`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    return null;
  }
};

export const getCustomer = async (customerId: string, session: Session) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/${customerId}/`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getCustomers = async (session: Session, page_to_query: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/?page=${page_to_query}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    return null;
  }
};

export const getQuotations = async (
  session: Session,
  page_to_query: string
) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quotations/?page=${page_to_query}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    console.log(res.data);

    return res.data;
  } catch (err) {
    return null;
  }
};

export const getProducts = async (session: Session, page_to_query: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/?page=${page_to_query}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err);
    }

    return null;
  }
};

export const getProduct = async (productId: string, session: Session) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return res.data.data;
  } catch (err) {
    return null;
  }
};
