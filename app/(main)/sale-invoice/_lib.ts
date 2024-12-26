import db from "@/lib/prisma";

export const getAllCompleteSaleInvoice = async (
  startDate: Date | undefined,
  endDate: Date | undefined,
  page: number
) => {
  try {
    let where: any = { is_done: true };
    console.log("Start Date", startDate, "End Date", endDate);
    if (startDate && endDate) {
      where = {
        ...where,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const invoices = await db.sale_invoice.findMany({
      where,
      select: {
        name: true,
        invoice_number: true,
        id: true,
        place: true,
        Sale_invoice_items: {
          select: {
            quantity: true,
            Products: {
              select: {
                sale_price: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * 10,
      take: 10,
    });

    const formattedInvoices = invoices.map((invoice) => {
      const total = invoice.Sale_invoice_items.reduce(
        (sum, item) => sum + (item.Products?.sale_price || 0) * item.quantity,
        0
      );

      return {
        id: invoice.id,
        name: invoice.name,
        invoice_number: invoice.invoice_number,
        place: invoice.place,
        total,
      };
    });

    return {
      data: { formattedInvoices },
      success: true,
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};

export const getOneSaleInvoice = async (id: number) => {
  try {
    const invoice = await db.sale_invoice.findUnique({
      where: { id },
      select: {
        name: true,
        note: true,
        place: true,
        discount: true,
        phone: true,
        createdAt: true,
        Sale_invoice_items: {
          select: {
            quantity: true,
            Products: {
              select: {
                name: true,
                barcode: true,
                sale_price: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return {
        message: "Invoice not found",
        success: false,
      };
    }

    // Consolidate products into a single array
    const products = invoice.Sale_invoice_items.map((item) => ({
      name: item.Products?.name,
      barcode: item.Products?.barcode,
      quantity: item.quantity,
      sale_price: item.Products?.sale_price,
    }));

    // Calculate total
    const total = products.reduce(
      (sum, product) => sum + product.quantity * (product.sale_price || 0),
      0
    );

    // Format response
    const formattedInvoice = {
      name: invoice.name,
      place: invoice.place,
      phone: invoice.phone,
      note: invoice.note,
      createdAt: invoice.createdAt,
      discount: invoice.discount,
      products,
      total,
    };

    return {
      data: formattedInvoice,
      success: true,
    };
  } catch (error: any) {
    console.error("Error fetching invoice:", error?.message);
    return {
      message: "هەڵەیەک هەیە",
      success: false,
    };
  }
};
