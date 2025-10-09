/**
 * Supabase Connection Test Utility
 * 
 * This file provides utilities to test your Supabase connection and field mappings.
 * Use these functions to verify that everything is working correctly.
 */

import { supabase, TABLES, testConnection } from './supabaseClient';
import { mapSupabasePropertyToFrontend } from './supabaseFieldMapper';
import type { Property } from '@/types';

// ============================================================================
// CONNECTION TESTS
// ============================================================================

/**
 * Test 1: Basic Connection Test
 * Verifies that the Supabase connection is working
 */
export async function testBasicConnection() {
  console.log('🧪 Test 1: Testing basic Supabase connection...');
  
  const result = await testConnection();
  
  if (result.success) {
    console.log('✅ Connection successful!');
    console.log('📊 Sample data:', result.data);
    return true;
  } else {
    console.error('❌ Connection failed:', result.error);
    return false;
  }
}

/**
 * Test 2: Fetch Single Property
 * Fetches one property from the database
 */
export async function testFetchSingleProperty() {
  console.log('🧪 Test 2: Fetching single property...');
  
  try {
    const { data, error } = await supabase
      .from(TABLES.PROPERTIES)
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error fetching property:', error);
      return { success: false, error };
    }

    console.log('✅ Property fetched successfully!');
    console.log('📊 Raw property data:', data);
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Exception fetching property:', error);
    return { success: false, error };
  }
}

/**
 * Test 3: Fetch Multiple Properties
 * Fetches multiple properties from the database
 */
export async function testFetchMultipleProperties(limit: number = 5) {
  console.log(`🧪 Test 3: Fetching ${limit} properties...`);
  
  try {
    const { data, error } = await supabase
      .from(TABLES.PROPERTIES)
      .select('*')
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching properties:', error);
      return { success: false, error };
    }

    console.log(`✅ ${data?.length || 0} properties fetched successfully!`);
    console.log('📊 Sample property data:', data?.[0]);
    
    return { success: true, data, count: data?.length || 0 };
  } catch (error) {
    console.error('❌ Exception fetching properties:', error);
    return { success: false, error };
  }
}

/**
 * Test 4: Test Property Count
 * Gets the total count of properties in the database
 */
export async function testPropertyCount() {
  console.log('🧪 Test 4: Counting properties...');
  
  try {
    const { count, error } = await supabase
      .from(TABLES.PROPERTIES)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error counting properties:', error);
      return { success: false, error };
    }

    console.log(`✅ Total properties in database: ${count}`);
    
    return { success: true, count };
  } catch (error) {
    console.error('❌ Exception counting properties:', error);
    return { success: false, error };
  }
}

// ============================================================================
// FIELD MAPPING TESTS
// ============================================================================

/**
 * Test 5: Test Field Mapping
 * Fetches a property and maps it using the field mapper
 */
export async function testFieldMapping() {
  console.log('🧪 Test 5: Testing field mapping...');
  
  try {
    // Fetch a property
    const { data, error } = await supabase
      .from(TABLES.PROPERTIES)
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error fetching property for mapping:', error);
      return { success: false, error };
    }

    console.log('📊 Raw database property:', data);
    
    // Map the property
    const mappedProperty: Property = mapSupabasePropertyToFrontend(data);
    
    console.log('📊 Mapped frontend property:', mappedProperty);
    console.log('✅ Field mapping completed!');
    
    // Show which fields were successfully mapped
    const mappedFields = Object.entries(mappedProperty)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key]) => key);
    
    console.log(`✅ ${mappedFields.length} fields successfully mapped:`, mappedFields);
    
    // Show which critical fields are still unmapped
    const criticalFields = [
      'ListingKey',
      'UnparsedAddress',
      'City',
      'ListPrice',
      'Bedrooms',
      'Bathrooms',
      'PropertyType',
      'MlsStatus'
    ];
    
    const unmappedCriticalFields = criticalFields.filter(
      field => !mappedFields.includes(field)
    );
    
    if (unmappedCriticalFields.length > 0) {
      console.log('⚠️ Critical fields still unmapped:', unmappedCriticalFields);
    } else {
      console.log('✅ All critical fields are mapped!');
    }
    
    return { 
      success: true, 
      rawData: data,
      mappedData: mappedProperty,
      mappedFieldsCount: mappedFields.length,
      unmappedCriticalFields 
    };
  } catch (error) {
    console.error('❌ Exception during field mapping:', error);
    return { success: false, error };
  }
}

/**
 * Test 6: Compare Raw and Mapped Data
 * Shows side-by-side comparison of raw database data and mapped frontend data
 */
export async function testCompareRawAndMapped() {
  console.log('🧪 Test 6: Comparing raw and mapped data...');
  
  try {
    // Fetch a property
    const { data, error } = await supabase
      .from(TABLES.PROPERTIES)
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error fetching property:', error);
      return { success: false, error };
    }

    // Map the property
    const mappedProperty = mapSupabasePropertyToFrontend(data);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('RAW DATABASE FIELDS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.table(data);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('MAPPED FRONTEND FIELDS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.table(mappedProperty);
    
    return { success: true, rawData: data, mappedData: mappedProperty };
  } catch (error) {
    console.error('❌ Exception during comparison:', error);
    return { success: false, error };
  }
}

// ============================================================================
// COMPREHENSIVE TEST SUITE
// ============================================================================

/**
 * Run All Tests
 * Runs all tests in sequence and provides a summary
 */
export async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 RUNNING SUPABASE CONNECTION AND MAPPING TESTS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  const results = {
    basicConnection: false,
    fetchSingle: false,
    fetchMultiple: false,
    propertyCount: false,
    fieldMapping: false,
    comparison: false,
  };
  
  // Test 1: Basic Connection
  results.basicConnection = await testBasicConnection();
  console.log('');
  
  if (!results.basicConnection) {
    console.log('❌ Basic connection failed. Please check your Supabase configuration.');
    console.log('   - Verify NEXT_PUBLIC_SUPABASE_URL in .env.local');
    console.log('   - Verify NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    console.log('   - Check if your Supabase project is active');
    return results;
  }
  
  // Test 2: Fetch Single
  const singleResult = await testFetchSingleProperty();
  results.fetchSingle = singleResult.success;
  console.log('');
  
  // Test 3: Fetch Multiple
  const multipleResult = await testFetchMultipleProperties(5);
  results.fetchMultiple = multipleResult.success;
  console.log('');
  
  // Test 4: Property Count
  const countResult = await testPropertyCount();
  results.propertyCount = countResult.success;
  console.log('');
  
  // Test 5: Field Mapping
  const mappingResult = await testFieldMapping();
  results.fieldMapping = mappingResult.success;
  console.log('');
  
  // Test 6: Comparison
  const comparisonResult = await testCompareRawAndMapped();
  results.comparison = comparisonResult.success;
  console.log('');
  
  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Basic Connection:      ${results.basicConnection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Fetch Single Property: ${results.fetchSingle ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Fetch Multiple Props:  ${results.fetchMultiple ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Property Count:        ${results.propertyCount ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Field Mapping:         ${results.fieldMapping ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Data Comparison:       ${results.comparison ? '✅ PASS' : '❌ FAIL'}`);
  console.log('═══════════════════════════════════════════════════════════');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your Supabase connection is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above and fix the issues.');
  }
  
  return results;
}

// ============================================================================
// SPECIFIC FIELD TESTS
// ============================================================================

/**
 * Test a specific field mapping
 * Useful for debugging individual field mappings
 */
export async function testSpecificField(fieldName: keyof Property) {
  console.log(`🧪 Testing mapping for field: ${fieldName}`);
  
  try {
    // Fetch a property
    const { data, error } = await supabase
      .from(TABLES.PROPERTIES)
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error fetching property:', error);
      return { success: false, error };
    }

    // Map the property
    const mappedProperty = mapSupabasePropertyToFrontend(data);
    
    const rawValue = data[fieldName];
    const mappedValue = mappedProperty[fieldName];
    
    console.log(`Raw value (${fieldName}):`, rawValue);
    console.log(`Mapped value (${fieldName}):`, mappedValue);
    
    if (mappedValue !== undefined && mappedValue !== null && mappedValue !== '') {
      console.log(`✅ Field "${fieldName}" is mapped correctly!`);
    } else {
      console.log(`⚠️ Field "${fieldName}" is not mapped or has no value`);
    }
    
    return { success: true, rawValue, mappedValue };
  } catch (error) {
    console.error('❌ Exception testing field:', error);
    return { success: false, error };
  }
}

// ============================================================================
// EXPORT TEST RUNNER
// ============================================================================

/**
 * Quick test function to run from a component or page
 * 
 * Usage in a component:
 * 
 * import { quickTest } from '@/lib/testSupabaseConnection';
 * 
 * // In your component
 * useEffect(() => {
 *   quickTest();
 * }, []);
 */
export async function quickTest() {
  console.log('🚀 Running quick Supabase test...');
  
  const connectionResult = await testBasicConnection();
  
  if (connectionResult) {
    await testFieldMapping();
  }
  
  console.log('✅ Quick test complete!');
}

