import db from "@/lib/prisma";

export const getAllCompleteInvoice = async () => {
  try {
    const invoices = await db.purchase_invoice.findMany({
      where: {
        is_done: true,
      },
      include: {
        Purchase_invoice_items: {
          include: {
            Products: true,
          },
        },
      },
    });

    let total = 0;
    invoices.forEach((invoice) => {
      invoice.Purchase_invoice_items.forEach((item) => {
        if (item.Products) {
          total += item.quantity * item.Products.purchase_price;
        }
      });
    });

    return {
      data: { invoices, total: total },
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
            quantity: true,
            Products: {
              select: {
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
