class SellerController {
    constructor(sellerUseCase) {
        this.sellerUseCase = sellerUseCase;
    }

    async register(req, res) {
        try {
            const seller = await this.sellerUseCase.registerSeller(req.body);
            res.status(201).json(seller);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllSellers(req, res) {
        try {
            const sellers = await this.sellerUseCase.getAllSellers();
            res.json(sellers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSeller(req, res) {
        try {
            const seller = await this.sellerUseCase.getSeller(req.params.id);
            if (!seller) return res.status(404).json({ error: "Seller not found" });
            res.json(seller);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SellerController;
