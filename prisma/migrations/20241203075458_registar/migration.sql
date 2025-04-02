-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registrationSeal" INTEGER NOT NULL,
    "passportId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Booking_service" (
    "idBooking" SERIAL NOT NULL,
    "idFlight" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    "bookDate" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL,
    "additionalService" TEXT,

    CONSTRAINT "Booking_service_pkey" PRIMARY KEY ("idBooking")
);

-- CreateTable
CREATE TABLE "Clients" (
    "idUser" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "thirdName" TEXT,
    "passportId" TEXT NOT NULL,
    "gender" TEXT,
    "email" TEXT,
    "telephone" TEXT,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Flight" (
    "idFlight" SERIAL NOT NULL,
    "flightNum" TEXT NOT NULL,
    "dateFlight" TIMESTAMP(3) NOT NULL,
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "numberOfSeats" INTEGER NOT NULL,
    "idPlane" INTEGER NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("idFlight")
);

-- CreateTable
CREATE TABLE "Plane" (
    "idPlane" SERIAL NOT NULL,
    "planeType" TEXT NOT NULL,
    "planeSeats" INTEGER NOT NULL,
    "luggageCapacity" INTEGER NOT NULL,

    CONSTRAINT "Plane_pkey" PRIMARY KEY ("idPlane")
);

-- CreateTable
CREATE TABLE "Sale_tickets" (
    "idSale" SERIAL NOT NULL,
    "idAirlines" INTEGER NOT NULL,
    "idFlight" INTEGER NOT NULL,
    "dateBuying" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "luggageAvailable" BOOLEAN NOT NULL,

    CONSTRAINT "Sale_tickets_pkey" PRIMARY KEY ("idSale")
);

-- CreateTable
CREATE TABLE "Airlines" (
    "idAirlines" SERIAL NOT NULL,
    "airlineName" TEXT NOT NULL,
    "contacts" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,

    CONSTRAINT "Airlines_pkey" PRIMARY KEY ("idAirlines")
);

-- CreateTable
CREATE TABLE "UserHasSale" (
    "idUser" INTEGER NOT NULL,
    "idSale" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_idUser_key" ON "User"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_service_idBooking_key" ON "Booking_service"("idBooking");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_idUser_key" ON "Clients"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_idFlight_key" ON "Flight"("idFlight");

-- CreateIndex
CREATE UNIQUE INDEX "Plane_idPlane_key" ON "Plane"("idPlane");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_tickets_idSale_key" ON "Sale_tickets"("idSale");

-- CreateIndex
CREATE UNIQUE INDEX "Airlines_idAirlines_key" ON "Airlines"("idAirlines");

-- CreateIndex
CREATE UNIQUE INDEX "UserHasSale_idUser_key" ON "UserHasSale"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "UserHasSale_idSale_key" ON "UserHasSale"("idSale");

-- AddForeignKey
ALTER TABLE "Booking_service" ADD CONSTRAINT "Booking_service_idFlight_fkey" FOREIGN KEY ("idFlight") REFERENCES "Flight"("idFlight") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking_service" ADD CONSTRAINT "Booking_service_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Clients"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_idPlane_fkey" FOREIGN KEY ("idPlane") REFERENCES "Plane"("idPlane") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale_tickets" ADD CONSTRAINT "Sale_tickets_idAirlines_fkey" FOREIGN KEY ("idAirlines") REFERENCES "Airlines"("idAirlines") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale_tickets" ADD CONSTRAINT "Sale_tickets_idFlight_fkey" FOREIGN KEY ("idFlight") REFERENCES "Flight"("idFlight") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHasSale" ADD CONSTRAINT "UserHasSale_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Clients"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHasSale" ADD CONSTRAINT "UserHasSale_idSale_fkey" FOREIGN KEY ("idSale") REFERENCES "Sale_tickets"("idSale") ON DELETE RESTRICT ON UPDATE CASCADE;
