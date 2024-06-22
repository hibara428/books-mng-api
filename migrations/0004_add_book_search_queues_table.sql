-- CreateTable
CREATE TABLE "BookSearchQueue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "searchConditonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookSearchQueue_searchConditonId_fkey" FOREIGN KEY ("searchConditonId") REFERENCES "SearchCondition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
