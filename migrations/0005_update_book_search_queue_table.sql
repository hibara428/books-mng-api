-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookSearchQueue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "searchConditonId" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookSearchQueue_searchConditonId_fkey" FOREIGN KEY ("searchConditonId") REFERENCES "SearchCondition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookSearchQueue" ("createdAt", "id", "searchConditonId") SELECT "createdAt", "id", "searchConditonId" FROM "BookSearchQueue";
DROP TABLE "BookSearchQueue";
ALTER TABLE "new_BookSearchQueue" RENAME TO "BookSearchQueue";
PRAGMA foreign_key_check("BookSearchQueue");
PRAGMA foreign_keys=ON;
