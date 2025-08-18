import { Task } from "@/types";

export const validateTask = (task: Task): void => {
  // check structure
  expect(task).toHaveProperty("id");
  expect(task).toHaveProperty("title");
  expect(task).toHaveProperty("description");
  expect(task).toHaveProperty("status");
  expect(task).toHaveProperty("due");
  expect(task).toHaveProperty("priority");
  expect(task).toHaveProperty("tags");
  expect(task).toHaveProperty("created_at");
  expect(task).toHaveProperty("updated_at");
  //  check types and value constraints
  expect(Number.isInteger(task.id)).toBe(true);
  expect(task.id).toBeGreaterThan(0);
  expect(typeof task.title).toBe("string");
  expect(
    typeof task.description === "string" || task.description === null
  ).toBe(true);
  expect(task.status).toMatch(/in_progress|complete|pending/);
  expect(task.priority).toMatch(/low|medium|high|urgent/);
  if (task.tags.length > 0) {
    task.tags.forEach((tag) => {
      expect(tag).toMatch(/pensions|documentation|benefits/);
    });
  }
  expect(() => new Date(task.due)).not.toThrow();
  expect(() => new Date(task.created_at)).not.toThrow();
  expect(() => new Date(task.updated_at)).not.toThrow();
  // adding 1000ms to account for clock differences between DB and test environment
  expect(new Date(task.created_at).getTime()).toBeLessThan(
    new Date().getTime() + 1000
  );
  if (task.updated_at) {
    expect(new Date(task.updated_at).getTime()).toBeLessThan(
      new Date().getTime() + 1000
    );
  }
  expect(new Date(task.due).getTime()).toBeGreaterThan(new Date().getTime());
};
