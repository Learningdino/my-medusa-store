import { BaseEntity, Customer, Product } from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Max, Min } from "class-validator";

import { generateEntityId } from "@medusajs/medusa/dist/utils";

export type ReviewStatus = "pending" | "approved" | "declined";

@Entity()
export class ProductReview extends BaseEntity {
  @Index()
  @Column({ type: "varchar", nullable: true })
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Index()
  @Column({ nullable: true })
  customer_id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "int" })
  @Min(1)
  @Max(5)
  rating: number;

  @Column({ nullable: false })
  content: string;

  @Column({
    type: "enum",
    enum: ["pending", "approved", "declined"],
    default: "pending",
  })
  status: ReviewStatus;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "prev");
  }
}
