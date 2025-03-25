import db from "@/lib/prisma";

export const getAllCompleteInvoice = async (
  startDate: Date | undefined,
  endDate: Date | undefined,
  page: number
) => {
  try {
    let where: any = { is_done: true };
    if (startDate && endDate) {
      where = {
        ...where,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };
    }
    const invoices = await db.purchase_invoice.findMany({
      where,
      select: {
        name: true,
        invoice_number: true,
        id: true,
        createdAt: true,
        Purchase_invoice_items: {
          select: {
            quantity: true,
            Products: {
              select: {
                purchase_price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    const formattedInvoices = invoices.map((invoice) => {
      const total = invoice.Purchase_invoice_items.reduce(
        (sum, item) =>
          sum + (item.Products?.purchase_price || 0) * item.quantity,
        0
      );

      return {
        id: invoice.id,
        name: invoice.name,
        invoice_number: invoice.invoice_number,
        createdAt: invoice.createdAt,
        total,
      };
    });

    return {
      data: {
        formattedInvoices,
        totalPage: Math.ceil((await db.purchase_invoice.count()) / 10),
      },
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

export const getOnePurchaseInvoice = async (id: number) => {
  try {
    const invoice = await db.purchase_invoice.findUnique({
      where: { id },
      select: {
        name: true,
        note: true,
        place: true,
        createdAt: true,
        Purchase_invoice_items: {
          select: {
            id: true,
            quantity: true,
            Products: {
              select: {
                id: true,
                name: true,
                barcode: true,
                purchase_price: true,
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
    const products = invoice.Purchase_invoice_items.map((item) => ({
      purchase_invoice_item_id: item.id,
      product_id: item.Products?.id,
      name: item.Products?.name,
      barcode: item.Products?.barcode,
      quantity: item.quantity,
      purchase_price: item.Products?.purchase_price,
    }));

    // Calculate total
    const total = products.reduce(
      (sum, product) => sum + product.quantity * (product.purchase_price || 0),
      0
    );

    // Format response
    const formattedInvoice = {
      name: invoice.name,
      place: invoice.place,
      note: invoice.note,
      createdAt: invoice.createdAt,
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
