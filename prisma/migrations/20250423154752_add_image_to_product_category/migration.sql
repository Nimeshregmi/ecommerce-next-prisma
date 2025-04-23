/*
  Warnings:

  - You are about to drop the `online_shopping_websites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "online_shopping_websites" DROP CONSTRAINT "online_shopping_websites_adminId_fkey";

-- DropForeignKey
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_websiteId_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" TEXT;

-- AlterTable
ALTER TABLE "product_categories" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "online_shopping_websites";
