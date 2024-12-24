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
            Products: true, // Include related product details
          },
        },
      },
    });

    // Calculate total price for each invoice
    let total = 0;
    invoices.forEach((invoice) => {
      invoice.Purchase_invoice_items.forEach((item) => {
        if (item.Products) {
          total += item.quantity * item.Products.purchase_price; // Calculate item total using purchase_price
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
