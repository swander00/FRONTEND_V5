/**
 * Supabase Connection Test Utility
 * 
 * This file provides utilities to test your Supabase connection.
 * Use these functions to verify that everything is working correctly.
 */

import { supabase, TABLES, testConnection } from './supabaseClient';
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
// DATABASE SCHEMA TESTS
// ============================================================================

/**
 * Test 5: Show Database Schema
 * Fetches a property and shows the available fields
 */
export async function testFieldMapping() {
  console.log('🧪 Test 5: Inspecting database schema...');
  
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

    console.log('📊 Raw database property:', data);
    
    // Show available fields
    const availableFields = Object.keys(data || {});
    
    console.log(`✅ ${availableFields.length} fields available in database:`);
    console.log(availableFields);
    
    return { 
      success: true, 
      rawData: data,
      availableFields,
      fieldCount: availableFields.length
    };
  } catch (error) {
    console.error('❌ Exception inspecting schema:', error);
    return { success: false, error };
  }
}

/**
 * Test 6: Show Raw Database Data
 * Displays raw data from the database
 */
export async function testCompareRawAndMapped() {
  console.log('🧪 Test 6: Displaying raw database data...');
  
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
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('RAW DATABASE FIELDS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.table(data);
    
    return { success: true, rawData: data };
  } catch (error) {
    console.error('❌ Exception fetching data:', error);
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
 * Test a specific field in the database
 * Useful for inspecting individual field values
 */
export async function testSpecificField(fieldName: string) {
  console.log(`🧪 Inspecting database field: ${fieldName}`);
  
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
    
    const rawValue = data[fieldName];
    
    console.log(`Raw value (${fieldName}):`, rawValue);
    
    if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
      console.log(`✅ Field "${fieldName}" has a value!`);
    } else {
      console.log(`⚠️ Field "${fieldName}" is empty or does not exist`);
    }
    
    return { success: true, rawValue };
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

