import supabase from "@/lib/supabase";
import { 
  DealSectionModel, 
  DealOverviewModel, 
  DealPurposeModel, 
  DealCollateralModel, 
  DealFinancialsModel, 
  DealSeniorDebtModel, 
  DealNextStepsModel,
  DealSectionName,
  DealOverviewForm,
  DealPurposeForm,
  DealCollateralForm,
  DealFinancialsForm,
  DealSeniorDebtForm,
  DealNextStepsForm
} from "@/types/deal/Deal.sections";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export class DealSectionsService {
  // =====================================================
  // DEAL SECTIONS MANAGEMENT
  // =====================================================

  /**
   * Creates or updates deal sections for a deal
   */
  static async createOrUpdateDealSections(dealId: string, sections: { [key in DealSectionName]: boolean }) {
    try {
      const sectionsData = Object.entries(sections).map(([sectionName, enabled]) => ({
        deal_id: dealId,
        section_name: sectionName.toLowerCase(),
        enabled
      }));

      const { data, error } = await supabase
        .from("deal_sections")
        .upsert(sectionsData, { 
          onConflict: 'deal_id,section_name',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealSectionModel[];
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateDealSections");
      throw error;
    }
  }

  /**
   * Gets all sections for a deal
   */
  static async getDealSections(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_sections")
        .select("*")
        .eq("deal_id", dealId);

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealSectionModel[];
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getDealSections");
      throw error;
    }
  }

  // =====================================================
  // DEAL OVERVIEW SECTION
  // =====================================================

  /**
   * Creates or updates deal overview section
   */
  static async createOrUpdateDealOverview(dealId: string, overviewData: DealOverviewForm) {
    try {
      const dataToInsert = {
        deal_id: dealId,
        sponsors: overviewData.sponsors,
        borrowers: overviewData.borrowers,
        lenders: overviewData.lenders,
        loan_request: overviewData.loanRequest,
        rate: overviewData.rate,
        status: overviewData.status
      };

      const { data, error } = await supabase
        .from("deal_overview")
        .upsert(dataToInsert, { 
          onConflict: 'deal_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealOverviewModel;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateDealOverview");
      throw error;
    }
  }

  /**
   * Gets deal overview section
   */
  static async getDealOverview(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_overview")
        .select("*")
        .eq("deal_id", dealId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return data ? camelcaseKeys(data, { deep: true }) as DealOverviewModel : null;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getDealOverview");
      throw error;
    }
  }

  // =====================================================
  // DEAL PURPOSE SECTION
  // =====================================================

  /**
   * Creates or updates deal purpose section
   */
  static async createOrUpdateDealPurpose(dealId: string, purposeData: DealPurposeForm) {
    try {
      const dataToInsert = {
        deal_id: dealId,
        purpose: purposeData.purpose,
        timeline: purposeData.timeline
      };

      const { data, error } = await supabase
        .from("deal_purpose")
        .upsert(dataToInsert, { 
          onConflict: 'deal_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealPurposeModel;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateDealPurpose");
      throw error;
    }
  }

  /**
   * Gets deal purpose section
   */
  static async getDealPurpose(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_purpose")
        .select("*")
        .eq("deal_id", dealId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? camelcaseKeys(data, { deep: true }) as DealPurposeModel : null;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getDealPurpose");
      throw error;
    }
  }

  // =====================================================
  // DEAL COLLATERAL SECTION
  // =====================================================

  /**
   * Creates or updates deal collateral section
   */
  static async createOrUpdateDealCollateral(dealId: string, collateralData: DealCollateralForm) {
    try {
      const dataToInsert = snakecaseKeys(collateralData, { deep: true });
      dataToInsert.deal_id = dealId;

      const { data, error } = await supabase
        .from("deal_collateral")
        .upsert(dataToInsert, { 
          onConflict: 'deal_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealCollateralModel;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateDealCollateral");
      throw error;
    }
  }

  /**
   * Gets deal collateral section
   */
  static async getDealCollateral(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_collateral")
        .select("*")
        .eq("deal_id", dealId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? camelcaseKeys(data, { deep: true }) as DealCollateralModel : null;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getDealCollateral");
      throw error;
    }
  }

  // =====================================================
  // DEAL FINANCIALS SECTION
  // =====================================================

  /**
   * Creates or updates deal financials section
   */
  static async createOrUpdateDealFinancials(dealId: string, financialsData: DealFinancialsForm) {
    try {
      const dataToInsert = snakecaseKeys(financialsData, { deep: true });
      dataToInsert.deal_id = dealId;

      const { data, error } = await supabase
        .from("deal_financials")
        .upsert(dataToInsert, { 
          onConflict: 'deal_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealFinancialsModel;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateDealFinancials");
      throw error;
    }
  }

  /**
   * Gets deal financials section
   */
  static async getDealFinancials(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_financials")
        .select("*")
        .eq("deal_id", dealId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? camelcaseKeys(data, { deep: true }) as DealFinancialsModel : null;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getDealFinancials");
      throw error;
    }
  }

  // =====================================================
  // DEAL SENIOR DEBT SECTION
  // =====================================================

  /**
   * Creates or updates deal senior debt section
   */
  static async createOrUpdateDealSeniorDebt(dealId: string, seniorDebtData: DealSeniorDebtForm) {
    try {
      const dataToInsert = snakecaseKeys(seniorDebtData, { deep: true });
      dataToInsert.deal_id = dealId;

      const { data, error } = await supabase
        .from("deal_senior_debt")
        .upsert(dataToInsert, { 
          onConflict: 'deal_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealSeniorDebtModel;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateDealSeniorDebt");
      throw error;
    }
  }

  /**
   * Gets deal senior debt section
   */
  static async getDealSeniorDebt(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_senior_debt")
        .select("*")
        .eq("deal_id", dealId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? camelcaseKeys(data, { deep: true }) as DealSeniorDebtModel : null;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getDealSeniorDebt");
      throw error;
    }
  }

  // =====================================================
  // DEAL NEXT STEPS SECTION
  // =====================================================

  /**
   * Creates or updates deal next steps section
   */
  static async createOrUpdateDealNextSteps(dealId: string, nextStepsData: DealNextStepsForm) {
    try {
      const dataToInsert = snakecaseKeys(nextStepsData, { deep: true });
      dataToInsert.deal_id = dealId;

      const { data, error } = await supabase
        .from("deal_next_steps")
        .upsert(dataToInsert, { 
          onConflict: 'deal_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealNextStepsModel;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateDealNextSteps");
      throw error;
    }
  }

  /**
   * Gets deal next steps section
   */
  static async getDealNextSteps(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_next_steps")
        .select("*")
        .eq("deal_id", dealId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? camelcaseKeys(data, { deep: true }) as DealNextStepsModel : null;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getDealNextSteps");
      throw error;
    }
  }

  // =====================================================
  // BULK OPERATIONS
  // =====================================================

  /**
   * Gets all sections for a deal in one call
   */
  static async getAllDealSections(dealId: string) {
    try {
      const [
        sections,
        overview,
        purpose,
        collateral,
        financials,
        seniorDebt,
        nextSteps
      ] = await Promise.all([
        this.getDealSections(dealId),
        this.getDealOverview(dealId),
        this.getDealPurpose(dealId),
        this.getDealCollateral(dealId),
        this.getDealFinancials(dealId),
        this.getDealSeniorDebt(dealId),
        this.getDealNextSteps(dealId)
      ]);

      return {
        sections,
        overview,
        purpose,
        collateral,
        financials,
        seniorDebt,
        nextSteps
      };
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.getAllDealSections");
      throw error;
    }
  }

  /**
   * Creates or updates all sections for a deal
   */
  static async createOrUpdateAllDealSections(
    dealId: string, 
    sectionsEnabled: { [key in DealSectionName]: boolean },
    sectionsData: {
      overview?: DealOverviewForm;
      purpose?: DealPurposeForm;
      collateral?: DealCollateralForm;
      financials?: DealFinancialsForm;
      seniorDebt?: DealSeniorDebtForm;
      nextSteps?: DealNextStepsForm;
    }
  ) {
    try {
      const results: any = {};

      // Update sections enabled status
      results.sections = await this.createOrUpdateDealSections(dealId, sectionsEnabled);

      // Update each section if data is provided
      if (sectionsData.overview) {
        results.overview = await this.createOrUpdateDealOverview(dealId, sectionsData.overview);
      }
      if (sectionsData.purpose) {
        results.purpose = await this.createOrUpdateDealPurpose(dealId, sectionsData.purpose);
      }
      if (sectionsData.collateral) {
        results.collateral = await this.createOrUpdateDealCollateral(dealId, sectionsData.collateral);
      }
      if (sectionsData.financials) {
        results.financials = await this.createOrUpdateDealFinancials(dealId, sectionsData.financials);
      }
      if (sectionsData.seniorDebt) {
        results.seniorDebt = await this.createOrUpdateDealSeniorDebt(dealId, sectionsData.seniorDebt);
      }
      if (sectionsData.nextSteps) {
        results.nextSteps = await this.createOrUpdateDealNextSteps(dealId, sectionsData.nextSteps);
      }

      return results;
    } catch (error) {
      ErrorService.handleApiError(error, "DealSectionsService.createOrUpdateAllDealSections");
      throw error;
    }
  }
}
