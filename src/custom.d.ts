import { AppAbility } from "./auth/casl/casl-abilities";

declare global {
    namespace Express {
        interface Request {
            ability: AppAbility;
            user: User;
        }
    }
}