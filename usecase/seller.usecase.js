class SellerUseCase {
    constructor(sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    async registerSeller(data) {
        const seller = new Seller(data);
        return await this.sellerRepository.createSeller(seller);
    }

    async getSeller(id) {
        return await this.sellerRepository.getSellerById(id);
    }

    async getAllSellers() { 
        return await this.sellerRepository.getAllSellers();
     }

    async verifySeller(id) {
        const seller = await this.getSeller(id);
        if (!seller) throw new Error("Seller not found");

        seller.markAsVerified();
        return await this.sellerRepository.updateSeller(seller);
    }

    async deleteSeller(id) {
        const seller = await this.getSeller(id);
        if (!seller) throw new Error("Seller not found");

        seller.softDelete();
        return await this.sellerRepository.updateSeller(seller);
    }
}

module.exports = SellerUseCase;
