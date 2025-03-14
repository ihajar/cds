import { faker } from "@faker-js/faker";
import { BodyType, ClassifiedStatus, Color, CurrencyCode, FuelType, OdoUnit, Prisma, PrismaClient, Transmission } from "@prisma/client";
import slugify from "slugify";


export async function seedClassifieds(prisma: PrismaClient) {
  const makes = await prisma.make.findMany({
    include: {
      models: {
        include: {
          modelVairants: true,
        },
      },
    },
  });

  const classifiedsData: Prisma.ClassifiedCreateManyInput[] = [];

  for (let i = 0; i < 25; i++) {
    const make = faker.helpers.arrayElement(makes);
    if (!make.models.length) continue;
    const model = faker.helpers.arrayElement(make.models);

    const variant = model.modelVairants.length
      ? faker.helpers.arrayElement(model.modelVairants)
      : null;
    
    console.log({ make, model, variant });

    const year = faker.date.between({
        from: new Date(1925, 0, 1),
        to: new Date()
    }).getFullYear();

    const title = [year, make.name, model.name, variant?.name].filter(Boolean).join(" ");

    const vrm = faker.vehicle.vrm();

    const baseSlug = slugify(`${title}-${vrm}`);

    classifiedsData.push({
        year,
        vrm,
        slug: baseSlug,
        makeId: make.id,
        modelId: model.id,
        ...(variant?.id && { modelVariantId: variant.id }),
        title,
        price: faker.number.int({ min: 400000, max: 10000000 }),
        odoReading: faker.number.int({ min: 0, max: 200000 }),
        doors: faker.number.int({ min: 2, max: 8 }),
        seats: faker.number.int({ min: 2, max: 8 }),
        views: faker.number.int({ min: 100, max: 10000 }),
        description: faker.commerce.productDescription(),
        currency: faker.helpers.arrayElement(Object.values(CurrencyCode)),
        odoUnit: faker.helpers.arrayElement(Object.values(OdoUnit)),
        bodyType: faker.helpers.arrayElement(Object.values(BodyType)),
        transmission: faker.helpers.arrayElement(Object.values(Transmission)),
        fuelType: faker.helpers.arrayElement(Object.values(FuelType)),
        color: faker.helpers.arrayElement(Object.values(Color)),
        status: faker.helpers.arrayElement(Object.values(ClassifiedStatus)),
    });
  }

  const result = await prisma.classified.createMany({
    data: classifiedsData,
    skipDuplicates: true, // prevent any duplicate errors from duplicate slugs
  })

  console.log(`Total of ${result.count} classifieds seeded 🌱`)
}
